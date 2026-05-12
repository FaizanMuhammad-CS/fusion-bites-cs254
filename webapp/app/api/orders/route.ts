import { NextRequest, NextResponse } from "next/server";

import pool from "@/src/lib/db";

export async function POST(
  request: NextRequest
) {

  const connection =
    await pool.getConnection();

  try {

    const body = await request.json();

    const {
      user_id,
      items,
      payment_method,
      delivery_address,
    } = body;

    if (!user_id) {
      return NextResponse.json(
        { error: "User session required" },
        { status: 400 }
      );
    }

    await connection.beginTransaction();

    let totalAmount = 0;

    for (const item of items) {

      totalAmount +=
        item.price * item.quantity;
    }

    const [orderResult]: any =
      await connection.query(
        `
        INSERT INTO Orders
        (
          user_id,
          restaurant_id,
          agent_id,
          delivery_address,
          total_amount,
          status
        )
        VALUES
        (?,1,1,?,?,?)
        `,
        [
          user_id,
          delivery_address,
          totalAmount,
          "Placed",
        ]
      );

    const orderId =
      orderResult.insertId;

    for (const item of items) {

      const subtotal =
        item.price * item.quantity;

      await connection.query(
        `
        INSERT INTO OrderItems
        (
          order_id,
          item_id,
          quantity,
          item_price,
          subtotal
        )
        VALUES
        (?,?,?,?,?)
        `,
        [
          orderId,
          item.item_id,
          item.quantity,
          item.price,
          subtotal,
        ]
      );
    }

    await connection.query(
      `
      INSERT INTO Payments
      (
        order_id,
        amount,
        method,
        status,
        transaction_reference
      )
      VALUES
      (?,?,?,?,?)
      `,
      [
        orderId,
        totalAmount,
        payment_method,
        "Completed",
        `TXN-${Date.now()}`,
      ]
    );

    await connection.commit();

    return NextResponse.json({
      success: true,
      order_id: orderId,
    });

  } catch (error) {

    await connection.rollback();

    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to place order",
      },
      {
        status: 500,
      }
    );

  } finally {

    connection.release();
  }
}