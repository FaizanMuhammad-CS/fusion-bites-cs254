import { NextRequest, NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";

import pool from "@/src/lib/db";

type InvoiceRow = RowDataPacket & {
  invoice_id: number;
  invoice_number: string;
  total_amount: string | number;
  generated_at: Date;
  order_id: number;
};

export async function GET(req: NextRequest) {
  try {
    const userId = Number(req.nextUrl.searchParams.get("user_id"));
    if (!Number.isFinite(userId) || userId <= 0) {
      return NextResponse.json({ error: "Invalid user_id" }, { status: 400 });
    }

    const [viewerRows] = await pool.query<RowDataPacket[]>(
      `SELECT role FROM Users WHERE user_id = ? LIMIT 1`,
      [userId]
    );
    if (!viewerRows[0]) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }
    const isAdmin = String(viewerRows[0].role) === "admin";

    const [rows] = await pool.query<InvoiceRow[]>(
      isAdmin
        ? `SELECT i.invoice_id,
                  i.invoice_number,
                  i.total_amount,
                  i.generated_at,
                  i.order_id
           FROM Invoices i
           INNER JOIN Orders o ON o.order_id = i.order_id
           ORDER BY i.generated_at DESC
           LIMIT 500`
        : `SELECT i.invoice_id,
                  i.invoice_number,
                  i.total_amount,
                  i.generated_at,
                  i.order_id
           FROM Invoices i
           INNER JOIN Orders o ON o.order_id = i.order_id
           WHERE o.user_id = ?
           ORDER BY i.generated_at DESC`,
      isAdmin ? [] : [userId]
    );

    const data = rows.map((r) => ({
      invoice_id: r.invoice_id,
      invoice_number: r.invoice_number,
      total_amount: Number(r.total_amount),
      generated_at:
        r.generated_at instanceof Date
          ? r.generated_at.toISOString()
          : String(r.generated_at),
      order_id: r.order_id,
    }));

    return NextResponse.json(data);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to load invoices" },
      { status: 500 }
    );
  }
}
