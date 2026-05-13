import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";

import pool from "@/src/lib/db";

type MenuRow = RowDataPacket & {
  item_id: number;
  name: string;
  category: string;
  description: string;
  price: number;
};

export async function GET() {
  try {
    const [rows] = await pool.query<MenuRow[]>(
      `SELECT item_id, name, category, description, price
       FROM MenuItems
       ORDER BY category, name`
    );
    const data = rows.map((r) => ({
      ...r,
      price: Number(r.price),
    }));
    return NextResponse.json(data);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to load menu" },
      { status: 500 }
    );
  }
}
