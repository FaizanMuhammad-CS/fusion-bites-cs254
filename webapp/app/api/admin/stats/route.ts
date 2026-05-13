import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";

import pool from "@/src/lib/db";

type StatsRow = RowDataPacket & {
  totalOrders: number;
  totalUsers: number;
  totalPayments: number;
  totalRevenue: string | number;
};

export async function GET() {
  try {
    const [rows] = await pool.query<StatsRow[]>(
      `SELECT
         (SELECT COUNT(*) FROM Orders) AS totalOrders,
         (SELECT COUNT(*) FROM Users) AS totalUsers,
         (SELECT COUNT(*) FROM Payments) AS totalPayments,
         (SELECT COALESCE(SUM(amount), 0) FROM Payments WHERE status = 'Completed') AS totalRevenue`
    );
    const row = rows[0];
    return NextResponse.json({
      totalOrders: Number(row?.totalOrders ?? 0),
      totalUsers: Number(row?.totalUsers ?? 0),
      totalPayments: Number(row?.totalPayments ?? 0),
      totalRevenue: Number(row?.totalRevenue ?? 0),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to load admin stats" },
      { status: 500 }
    );
  }
}
