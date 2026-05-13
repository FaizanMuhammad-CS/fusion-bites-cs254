import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";

import pool from "@/src/lib/db";

type CountRow = RowDataPacket & { c: number };
type TopRow = RowDataPacket & { name: string; totalSold: number };
type PayRow = RowDataPacket & { method: string; total: number };
type RevRow = RowDataPacket & { totalRevenue: string | number };

export async function GET() {
  try {
    const [[orderRows], [topRows], [payRows], [revRows]] = await Promise.all([
      pool.query<CountRow[]>(`SELECT COUNT(*) AS c FROM Orders`),
      pool.query<TopRow[]>(
        `SELECT mi.name AS name, SUM(oi.quantity) AS totalSold
         FROM OrderItems oi
         INNER JOIN MenuItems mi ON mi.item_id = oi.item_id
         GROUP BY mi.item_id, mi.name
         ORDER BY totalSold DESC
         LIMIT 10`
      ),
      pool.query<PayRow[]>(
        `SELECT method, COUNT(*) AS total
         FROM Payments
         GROUP BY method
         ORDER BY total DESC`
      ),
      pool.query<RevRow[]>(
        `SELECT COALESCE(SUM(amount), 0) AS totalRevenue
         FROM Payments
         WHERE status = 'Completed'`
      ),
    ]);

    return NextResponse.json({
      totalOrders: Number(orderRows[0]?.c ?? 0),
      totalRevenue: Number(revRows[0]?.totalRevenue ?? 0),
      topItems: topRows.map((r) => ({
        name: r.name,
        totalSold: Number(r.totalSold),
      })),
      paymentStats: payRows.map((r) => ({
        method: r.method,
        total: Number(r.total),
      })),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to load dashboard" },
      { status: 500 }
    );
  }
}
