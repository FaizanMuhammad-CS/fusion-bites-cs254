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
        o.order_id,
        o.order_time,
        o.status,
        o.total_amount,
        p.method AS payment_method,
        p.status AS payment_status
      FROM Orders o
      LEFT JOIN Payments p
      ON o.order_id = p.order_id
      WHERE o.user_id = ?
      ORDER BY o.order_time DESC
      `,
      [Number(userId)]
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch order history" }, { status: 500 });
  }
}
