import { NextRequest, NextResponse } from "next/server";
import type { ResultSetHeader } from "mysql2";

import pool from "@/src/lib/db";

const ORDER_STATUSES = [
  "Placed",
  "Preparing",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
] as const;

type OrderStatus = (typeof ORDER_STATUSES)[number];

function isOrderStatus(s: string): s is OrderStatus {
  return (ORDER_STATUSES as readonly string[]).includes(s);
}

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await ctx.params;
    const orderId = Number(idParam);
    if (!Number.isFinite(orderId) || orderId <= 0) {
      return NextResponse.json({ error: "Invalid order id." }, { status: 400 });
    }

    const body = (await req.json()) as { status?: string };
    const status = body.status?.trim() ?? "";
    if (!isOrderStatus(status)) {
      return NextResponse.json(
        { error: "Invalid order status." },
        { status: 400 }
      );
    }

    const [res] = await pool.query<ResultSetHeader>(
      `UPDATE Orders SET status = ? WHERE order_id = ?`,
      [status, orderId]
    );

    if (res.affectedRows === 0) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    return NextResponse.json({ order_id: orderId, status });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to update order." },
      { status: 500 }
    );
  }
}
