import { NextRequest, NextResponse } from "next/server";

import pool from "@/src/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [rows]: any = await pool.query(
      `
      SELECT
        i.invoice_id,
        i.invoice_number,
        i.subtotal,
        i.tax AS tax_amount,
        i.total_amount,
        i.generated_at,
        o.order_id,
        o.delivery_address,
        o.order_time,
        u.name AS customer_name,
        u.email AS customer_email,
        p.method AS payment_method,
        p.status AS payment_status,
        p.transaction_reference
      FROM Invoices i
      JOIN Orders o
      ON i.order_id = o.order_id
      JOIN Users u
      ON o.user_id = u.user_id
      LEFT JOIN Payments p
      ON o.order_id = p.order_id
      WHERE i.invoice_id = ?
      LIMIT 1
      `,
      [Number(id)]
    );

    if (!rows.length) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const [items] = await pool.query(
      `
      SELECT
        oi.quantity,
        oi.item_price,
        oi.subtotal,
        m.name
      FROM OrderItems oi
      JOIN MenuItems m
      ON oi.item_id = m.item_id
      WHERE oi.order_id = ?
      `,
      [rows[0].order_id]
    );

    return NextResponse.json({
      ...rows[0],
      items,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch invoice" }, { status: 500 });
  }
}
