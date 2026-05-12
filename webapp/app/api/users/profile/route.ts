import { NextRequest, NextResponse } from "next/server";

import pool from "@/src/lib/db";

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json({ error: "user_id is required" }, { status: 400 });
    }

    const [profileRows]: any = await pool.query(
      `
      SELECT
        user_id,
        name,
        email,
        role
      FROM Users
      WHERE user_id = ?
      LIMIT 1
      `,
      [Number(userId)]
    );

    if (!profileRows.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const [statsRows]: any = await pool.query(
      `
      SELECT
        COUNT(*) AS totalOrders,
        IFNULL(SUM(total_amount), 0) AS totalSpent
      FROM Orders
      WHERE user_id = ?
      `,
      [Number(userId)]
    );

    return NextResponse.json({
      ...profileRows[0],
      ...statsRows[0],
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch profile data" }, { status: 500 });
  }
}
