import { NextRequest, NextResponse } from "next/server";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

import pool from "@/src/lib/db";

type PriceRow = RowDataPacket & {
  item_id: number;
  price: string | number;
  restaurant_id: number;
};

type CartLine = {
  item_id: number;
  quantity: number;
};

const PAYMENT_METHODS = new Set(["Cash", "Card", "Online"]);

export async function POST(req: NextRequest) {
  let body: {
    user_id?: number;
    delivery_address?: string;
    payment_method?: string;
    items?: CartLine[];
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const userId = Number(body.user_id);
  const deliveryAddress = body.delivery_address?.trim() ?? "";
  const paymentMethod = body.payment_method ?? "Cash";
  const items = Array.isArray(body.items) ? body.items : [];

  if (!Number.isFinite(userId) || userId <= 0) {
    return NextResponse.json({ error: "Invalid user" }, { status: 400 });
  }
  if (!deliveryAddress) {
    return NextResponse.json(
      { error: "Delivery address is required" },
      { status: 400 }
    );
  }
  if (items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }
  if (!PAYMENT_METHODS.has(paymentMethod)) {
    return NextResponse.json(
      { error: "Invalid payment method" },
      { status: 400 }
    );
  }

  const conn = await pool.getConnection();
  try {
    const itemIds = [...new Set(items.map((i) => i.item_id))];
    const placeholders = itemIds.map(() => "?").join(", ");
    const [priceRows] = await conn.query<PriceRow[]>(
      `SELECT item_id, price, restaurant_id
       FROM MenuItems
       WHERE item_id IN (${placeholders})`,
      itemIds
    );

    if (priceRows.length !== itemIds.length) {
      return NextResponse.json(
        { error: "One or more menu items are invalid" },
        { status: 400 }
      );
    }

    const priceById = new Map(
      priceRows.map((r) => [
        r.item_id,
        { price: Number(r.price), restaurant_id: r.restaurant_id },
      ])
    );

    let total = 0;
    const lines: {
      item_id: number;
      quantity: number;
      item_price: number;
      subtotal: number;
      restaurant_id: number;
    }[] = [];

    for (const line of items) {
      const q = Math.floor(Number(line.quantity));
      if (!Number.isFinite(line.item_id) || q <= 0) {
        return NextResponse.json({ error: "Invalid cart line" }, { status: 400 });
      }
      const meta = priceById.get(line.item_id);
      if (!meta) {
        return NextResponse.json({ error: "Invalid cart line" }, { status: 400 });
      }
      const subtotal = meta.price * q;
      total += subtotal;
      lines.push({
        item_id: line.item_id,
        quantity: q,
        item_price: meta.price,
        subtotal,
        restaurant_id: meta.restaurant_id,
      });
    }

    const restaurantId = lines[0].restaurant_id;
    if (lines.some((l) => l.restaurant_id !== restaurantId)) {
      return NextResponse.json(
        { error: "Cart contains items from multiple restaurants" },
        { status: 400 }
      );
    }

    await conn.beginTransaction();

    const [orderRes] = await conn.query<ResultSetHeader>(
      `INSERT INTO Orders (user_id, restaurant_id, total_amount, delivery_address, status)
       VALUES (?, ?, ?, ?, 'Placed')`,
      [userId, restaurantId, total, deliveryAddress]
    );
    const orderId = orderRes.insertId;

    for (const line of lines) {
      await conn.query(
        `INSERT INTO OrderItems (order_id, item_id, quantity, item_price, subtotal)
         VALUES (?, ?, ?, ?, ?)`,
        [orderId, line.item_id, line.quantity, line.item_price, line.subtotal]
      );
    }

    await conn.query(
      `INSERT INTO Payments (order_id, amount, method, status)
       VALUES (?, ?, ?, 'Completed')`,
      [orderId, total, paymentMethod]
    );

    const invoiceNumber = `INV-${orderId}-${Date.now()}`;
    await conn.query(
      `INSERT INTO Invoices (order_id, invoice_number, subtotal, tax, delivery_fee, total_amount)
       VALUES (?, ?, ?, 0, 0, ?)`,
      [orderId, invoiceNumber, total, total]
    );

    await conn.commit();
    return NextResponse.json({ order_id: orderId });
  } catch (e) {
    await conn.rollback();
    console.error(e);
    return NextResponse.json(
      { error: "Failed to place order" },
      { status: 500 }
    );
  } finally {
    conn.release();
  }
}
