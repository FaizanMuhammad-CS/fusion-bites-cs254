import { NextResponse } from "next/server";

import pool from "@/src/lib/db";

export async function GET() {

  try {

    const [rows] = await pool.query(
      `
      SELECT

        p.payment_id,
        p.order_id,
        p.amount,
        p.method,
        p.status,

        t.transaction_id,

        u.name AS customer_name

      FROM Payments p

      LEFT JOIN Transactions t
        ON p.payment_id = t.payment_id

      LEFT JOIN Orders o
        ON p.order_id = o.order_id

      LEFT JOIN Users u
        ON o.user_id = u.user_id

      ORDER BY p.payment_id DESC
      `
    );

    return NextResponse.json(rows);

  } catch (error) {

    console.error(
      "PAYMENTS API ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to fetch payments",
      },
      {
        status: 500,
      }
    );
  }
}