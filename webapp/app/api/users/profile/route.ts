import { NextRequest, NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";

import pool from "@/src/lib/db";

type ProfileRow = RowDataPacket & {
  user_id: number;
  name: string;
  email: string;
  role: string;
  totalOrders: number;
  totalSpent: string | number;
};

export async function GET(req: NextRequest) {
  try {
    const userId = Number(req.nextUrl.searchParams.get("user_id"));
    if (!Number.isFinite(userId) || userId <= 0) {
      return NextResponse.json({ error: "Invalid user_id" }, { status: 400 });
    }

    const [rows] = await pool.query<ProfileRow[]>(
      `SELECT u.user_id,
              u.name,
              u.email,
              u.role,
              COUNT(DISTINCT o.order_id) AS totalOrders,
              COALESCE(SUM(o.total_amount), 0) AS totalSpent
       FROM Users u
       LEFT JOIN Orders o ON o.user_id = u.user_id
       WHERE u.user_id = ?
       GROUP BY u.user_id, u.name, u.email, u.role`,
      [userId]
    );

    const row = rows[0];
    if (!row) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user_id: row.user_id,
      name: row.name,
      email: row.email,
      role: row.role,
      totalOrders: Number(row.totalOrders),
      totalSpent: Number(row.totalSpent),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to load profile" },
      { status: 500 }
    );
  }
}
