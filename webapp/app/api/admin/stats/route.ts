import { NextResponse }
from "next/server";

import pool
from "@/src/lib/db";

export async function GET() {

  try {

    const [ordersRows]: any =
      await pool.query(`
        SELECT COUNT(*)
        AS totalOrders
        FROM Orders
      `);

    const [usersRows]: any =
      await pool.query(`
        SELECT COUNT(*)
        AS totalUsers
        FROM Users
      `);

    const [paymentsRows]: any =
      await pool.query(`
        SELECT COUNT(*)
        AS totalPayments
        FROM Payments
      `);

    const [revenueRows]: any =
      await pool.query(`
        SELECT
          IFNULL(
            SUM(total_amount),
            0
          )
          AS totalRevenue
        FROM Orders
      `);

    return NextResponse.json({

      totalOrders:
        ordersRows[0]
          .totalOrders,

      totalUsers:
        usersRows[0]
          .totalUsers,

      totalPayments:
        paymentsRows[0]
          .totalPayments,

      totalRevenue:
        revenueRows[0]
          .totalRevenue,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to fetch admin stats",
      },
      {
        status: 500,
      }
    );
  }
}