import { NextRequest, NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";

import pool from "@/src/lib/db";

type InvoiceRow = RowDataPacket & {
  invoice_id: number;
  invoice_number: string;
  subtotal: string | number;
  tax: string | number;
  delivery_fee: string | number;
  total_amount: string | number;
  generated_at: Date;
  order_id: number;
  order_user_id: number;
};

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await ctx.params;
    const invoiceId = Number(idParam);
    if (!Number.isFinite(invoiceId) || invoiceId <= 0) {
      return NextResponse.json({ error: "Invalid invoice id." }, { status: 400 });
    }

    const viewerId = Number(req.nextUrl.searchParams.get("user_id"));
    if (!Number.isFinite(viewerId) || viewerId <= 0) {
      return NextResponse.json({ error: "Invalid user_id." }, { status: 400 });
    }

    const [viewerRows] = await pool.query<RowDataPacket[]>(
      `SELECT role FROM Users WHERE user_id = ? LIMIT 1`,
      [viewerId]
    );
    if (!viewerRows[0]) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }
    const viewerRole = String(viewerRows[0].role);

    const [rows] = await pool.query<InvoiceRow[]>(
      `SELECT i.invoice_id,
              i.invoice_number,
              i.subtotal,
              i.tax,
              i.delivery_fee,
              i.total_amount,
              i.generated_at,
              i.order_id,
              o.user_id AS order_user_id
       FROM Invoices i
       INNER JOIN Orders o ON o.order_id = i.order_id
       WHERE i.invoice_id = ?
       LIMIT 1`,
      [invoiceId]
    );

    const row = rows[0];
    if (!row) {
      return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
    }

    const isAdminViewer = viewerRole === "admin";
    if (!isAdminViewer && row.order_user_id !== viewerId) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    return NextResponse.json({
      invoice_id: row.invoice_id,
      invoice_number: row.invoice_number,
      subtotal: Number(row.subtotal),
      tax: Number(row.tax),
      delivery_fee: Number(row.delivery_fee),
      total_amount: Number(row.total_amount),
      generated_at:
        row.generated_at instanceof Date
          ? row.generated_at.toISOString()
          : String(row.generated_at),
      order_id: row.order_id,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to load invoice." },
      { status: 500 }
    );
  }
}
