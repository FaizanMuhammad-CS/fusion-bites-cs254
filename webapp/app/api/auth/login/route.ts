import { NextRequest, NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";

import pool from "@/src/lib/db";

type UserRow = RowDataPacket & {
  user_id: number;
  name: string;
  email: string;
  role: "customer" | "admin";
  password: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { email?: string; password?: string };
    const email = body.email?.trim().toLowerCase();
    const password = body.password ?? "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const [rows] = await pool.query<UserRow[]>(
      `SELECT user_id, name, email, role, password FROM Users WHERE LOWER(email) = ? LIMIT 1`,
      [email]
    );

    const user = rows[0];
    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
