import { NextRequest, NextResponse } from "next/server";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

import pool from "@/src/lib/db";

type CountRow = RowDataPacket & { c: number };

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      name?: string;
      email?: string;
      password?: string;
      phone?: string;
      address?: string;
    };

    const name = body.name?.trim() ?? "";
    const email = body.email?.trim().toLowerCase() ?? "";
    const password = body.password ?? "";
    const phone = body.phone?.trim() || null;
    const address = body.address?.trim() ?? "";

    if (!name || !email || !password || !address) {
      return NextResponse.json(
        { error: "Name, email, password, and address are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const [existing] = await pool.query<CountRow[]>(
      `SELECT COUNT(*) AS c FROM Users WHERE LOWER(email) = ? LIMIT 1`,
      [email]
    );
    if (Number(existing[0]?.c) > 0) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    if (phone) {
      const [phoneDup] = await pool.query<CountRow[]>(
        `SELECT COUNT(*) AS c FROM Users WHERE phone = ? LIMIT 1`,
        [phone]
      );
      if (Number(phoneDup[0]?.c) > 0) {
        return NextResponse.json(
          { error: "This phone number is already registered." },
          { status: 409 }
        );
      }
    }

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO Users (name, email, password, role, phone, address)
       VALUES (?, ?, ?, 'customer', ?, ?)`,
      [name, email, password, phone, address]
    );

    const user_id = result.insertId;
    if (!user_id) {
      return NextResponse.json(
        { error: "Registration failed. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      user: {
        user_id,
        name,
        email,
        role: "customer" as const,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}
