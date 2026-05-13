import { NextRequest, NextResponse } from "next/server";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

import pool from "@/src/lib/db";

type UserRow = RowDataPacket & {
  user_id: number;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  address: string;
  created_at: Date;
};

export async function GET() {
  try {
    const [rows] = await pool.query<UserRow[]>(
      `SELECT user_id, name, email, role, phone, address, created_at
       FROM Users
       ORDER BY created_at DESC`
    );

    const data = rows.map((r) => ({
      user_id: r.user_id,
      name: r.name,
      email: r.email,
      role: r.role,
      phone: r.phone,
      address: r.address,
      created_at:
        r.created_at instanceof Date
          ? r.created_at.toISOString()
          : String(r.created_at),
    }));

    return NextResponse.json(data);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to load users" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      name?: string;
      email?: string;
      password?: string;
      role?: string;
      phone?: string | null;
      address?: string;
    };

    const name = body.name?.trim() ?? "";
    const email = body.email?.trim().toLowerCase() ?? "";
    const password = body.password ?? "";
    const role = body.role === "admin" ? "admin" : "customer";
    const address = body.address?.trim() ?? "";
    const phoneRaw = body.phone?.trim();
    const phone = phoneRaw ? phoneRaw : null;

    if (!name || !email || !password || !address) {
      return NextResponse.json(
        { error: "Name, email, password, and address are required." },
        { status: 400 }
      );
    }

    const [res] = await pool.query<ResultSetHeader>(
      `INSERT INTO Users (name, email, password, role, phone, address)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, email, password, role, phone, address]
    );

    return NextResponse.json({ user_id: res.insertId });
  } catch (e: unknown) {
    const err = e as { code?: string };
    if (err.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        { error: "Email or phone already in use." },
        { status: 409 }
      );
    }
    console.error(e);
    return NextResponse.json(
      { error: "Failed to create user." },
      { status: 500 }
    );
  }
}