import { NextRequest, NextResponse } from "next/server";

import pool from "@/src/lib/db";

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json({ error: "user_id is required" }, { status: 400 });
    }

    const [rows] = await pool.query(
      `
      SELECT
        i.invoice_id,
        i.invoice_number,
        i.total_amount,
        i.generated_at,
        i.order_id
      FROM Invoices i
      JOIN Orders o
      ON i.order_id = o.order_id
      WHERE o.user_id = ?
      ORDER BY i.generated_at DESC
      `,
      [Number(userId)]
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 });
  }
}
