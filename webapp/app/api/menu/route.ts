import { NextResponse } from "next/server";
import pool from "@/src/lib/db";

export async function GET() {
  try {

    const [rows] = await pool.query(`
      SELECT
        item_id,
        name,
        category,
        description,
        price
      FROM MenuItems
      ORDER BY category, name
    `);

    return NextResponse.json(rows);

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to fetch menu items"
      },
      {
        status: 500
      }
    );
  }
}