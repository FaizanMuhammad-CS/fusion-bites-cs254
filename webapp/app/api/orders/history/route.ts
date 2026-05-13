import { NextRequest, NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";

import pool from "@/src/lib/db";

type HistoryRow = RowDataPacket & {
  order_id: number;
  order_time: Date;
  status: string;
  total_amount: string | number;
  payment_method: string | null;
  payment_status: string | null;
};

export async function GET(req: NextRequest) {
  try {
    const userId = Number(req.nextUrl.searchParams.get("user_id"));
    if (!Number.isFinite(userId) || userId <= 0) {
      return NextResponse.json({ error: "Invalid user_id" }, { status: 400 });
    }

    const [rows] = await pool.query<HistoryRow[]>(
      `SELECT o.order_id,
              o.order_time,
              o.status,
              o.total_amount,
              p.method AS payment_method,
              p.status AS payment_status
       FROM Orders o
       LEFT JOIN Payments p ON p.order_id = o.order_id
       WHERE o.user_id = ?
       ORDER BY o.order_time DESC`,
      [userId]
    );

    const data = rows.map((r) => ({
      order_id: r.order_id,
      order_time:
        r.order_time instanceof Date
          ? r.order_time.toISOString()
          : String(r.order_time),
      status: r.status,
      total_amount: Number(r.total_amount),
      payment_method: r.payment_method,
      payment_status: r.payment_status,
    }));

    return NextResponse.json(data);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to load order history" },
      { status: 500 }
    );
  }
}
