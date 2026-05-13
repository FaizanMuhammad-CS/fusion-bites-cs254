import { NextRequest, NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";

import pool from "@/src/lib/db";

type OrderRow = RowDataPacket & {
  order_id: number;
  customer_name: string;
  total_amount: string | number;
  status: string;
  payment_method: string | null;
  order_time: Date;
};

export async function GET(req: NextRequest) {
  try {
    const raw = req.nextUrl.searchParams.get("limit");
    const parsed = raw != null ? Number(raw) : 50;
    const limit = Number.isFinite(parsed)
      ? Math.min(500, Math.max(1, Math.floor(parsed)))
      : 50;

    const [rows] = await pool.query<OrderRow[]>(
      `SELECT o.order_id,
              u.name AS customer_name,
              o.total_amount,
              o.status,
              p.method AS payment_method,
              o.order_time
       FROM Orders o
       INNER JOIN Users u ON u.user_id = o.user_id
       LEFT JOIN Payments p ON p.order_id = o.order_id
       ORDER BY o.order_time DESC
       LIMIT ?`,
      [limit]
    );

    const data = rows.map((r) => ({
      order_id: r.order_id,
      customer_name: r.customer_name,
      total_amount: Number(r.total_amount),
      status: r.status,
      payment_method: r.payment_method ?? "",
      order_time:
        r.order_time instanceof Date
          ? r.order_time.toISOString()
          : String(r.order_time),
    }));

    return NextResponse.json(data);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to load orders" },
      { status: 500 }
    );
  }
}
