import {
  NextRequest,
  NextResponse,
} from "next/server";

import pool from "@/src/lib/db";

export async function GET() {

  try {

    const [rows] =
      await pool.query(`
        SELECT

          Orders.order_id,

          Users.name
          AS customer_name,

          Orders.total_amount,

          Orders.status,

          Orders.order_time,

          Payments.method
          AS payment_method

        FROM Orders

        JOIN Users
        ON Orders.user_id =
           Users.user_id

        LEFT JOIN Payments
        ON Orders.order_id =
           Payments.order_id

        ORDER BY
        Orders.order_time DESC
      `);

    return NextResponse.json(rows);

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to fetch orders",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(
  request: NextRequest
) {

  try {

    const body =
      await request.json();

    const {
      order_id,
      status,
    } = body;

    await pool.query(
      `
      UPDATE Orders
      SET status = ?
      WHERE order_id = ?
      `,
      [
        status,
        order_id,
      ]
    );

    return NextResponse.json({
      success: true,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to update order",
      },
      {
        status: 500,
      }
    );
  }
}