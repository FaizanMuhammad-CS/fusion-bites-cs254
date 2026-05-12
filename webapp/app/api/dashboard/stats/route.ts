import { NextResponse } from "next/server";

import pool from "@/src/lib/db";

export async function GET() {

  try {

    const [totalOrdersRows]: any =
      await pool.query(`
        SELECT COUNT(*) AS totalOrders
        FROM Orders
      `);

    const [revenueRows]: any =
      await pool.query(`
        SELECT
          IFNULL(
            SUM(total_amount),
            0
          ) AS totalRevenue
        FROM Orders
      `);

    const [topItemsRows]: any =
      await pool.query(`
        SELECT
          MenuItems.name,
          SUM(OrderItems.quantity)
            AS totalSold
        FROM OrderItems

        JOIN MenuItems
        ON OrderItems.item_id =
           MenuItems.item_id

        GROUP BY MenuItems.name

        ORDER BY totalSold DESC

        LIMIT 5
      `);

    const [paymentStatsRows]: any =
      await pool.query(`
        SELECT
          method,
          COUNT(*) AS total
        FROM Payments

        GROUP BY method
      `);

    return NextResponse.json({

      totalOrders:
        totalOrdersRows[0]
          .totalOrders,

      totalRevenue:
        revenueRows[0]
          .totalRevenue,

      topItems:
        topItemsRows,

      paymentStats:
        paymentStatsRows,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to fetch dashboard stats",
      },
      {
        status: 500,
      }
    );
  }
}