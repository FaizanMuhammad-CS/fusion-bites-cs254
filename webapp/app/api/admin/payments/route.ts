import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";

import pool from "@/src/lib/db";

type PaymentRow = RowDataPacket & {
  payment_id: number;
  order_id: number | null;
  amount: string | number;
  method: string | null;
  status: string | null;
  payment_time: Date;
  customer_name: string | null;
};

export async function GET() {
  try {
    const [rows] = await pool.query<PaymentRow[]>(
      `SELECT p.payment_id,
              p.order_id,
              p.amount,
              p.method,
              p.status,
              p.payment_time,
              u.name AS customer_name
       FROM Payments p
       LEFT JOIN Orders o ON o.order_id = p.order_id
       LEFT JOIN Users u ON u.user_id = o.user_id
       ORDER BY p.payment_time DESC
       LIMIT 500`
    );

    const data = rows.map((r) => ({
      payment_id: r.payment_id,
      order_id: r.order_id,
      amount: Number(r.amount),
      method: r.method ?? "",
      status: r.status ?? "",
      customer_name: r.customer_name ?? "",
      payment_time:
        r.payment_time instanceof Date
          ? r.payment_time.toISOString()
          : String(r.payment_time),
    }));

    return NextResponse.json(data);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to load payments" },
      { status: 500 }
    );
  }
}
