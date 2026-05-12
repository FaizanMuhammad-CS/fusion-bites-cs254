import { NextRequest, NextResponse } from "next/server";

import pool from "@/src/lib/db";

type CreateUserBody = {
  name?: string;
  email?: string;
  password?: string;
  role?: "customer" | "admin";
  phone?: string | null;
  address?: string;
};

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get("query") ?? "";

    const [rows] = await pool.query(
      `
      SELECT
        user_id,
        name,
        email,
        role
      FROM Users
      WHERE name LIKE ? OR email LIKE ?
      ORDER BY role ASC, name ASC
      `,
      [`%${query}%`, `%${query}%`]
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateUserBody;

    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password ?? "";
    const role = body.role === "admin" ? "admin" : "customer";
    const address = body.address?.trim();
    const phoneRaw = body.phone?.trim();
    const phone =
      phoneRaw && phoneRaw.length > 0 ? phoneRaw : null;

    if (!name || !email || !password || !address) {
      return NextResponse.json(
        { error: "name, email, password, and address are required" },
        { status: 400 }
      );
    }

    const [result]: any = await pool.query(
      `
      INSERT INTO Users (name, email, password, role, phone, address)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [name, email, password, role, phone, address]
    );

    return NextResponse.json({
      success: true,
      user_id: result.insertId as number,
    });
  } catch (error: unknown) {
    const err = error as { code?: string };
    if (err.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        { error: "Email or phone already exists" },
        { status: 409 }
      );
    }
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userIdParam = request.nextUrl.searchParams.get("user_id");
    const actorIdParam =
      request.nextUrl.searchParams.get("actor_user_id");

    const userId = userIdParam ? Number(userIdParam) : NaN;
    const actorId = actorIdParam ? Number(actorIdParam) : NaN;

    if (!Number.isFinite(userId) || userId < 1) {
      return NextResponse.json(
        { error: "user_id query parameter is required" },
        { status: 400 }
      );
    }

    if (Number.isFinite(actorId) && actorId === userId) {
      return NextResponse.json(
        { error: "You cannot delete your own account" },
        { status: 400 }
      );
    }

    const [targetRows]: any = await pool.query(
      `
      SELECT role FROM Users WHERE user_id = ? LIMIT 1
      `,
      [userId]
    );

    if (!targetRows.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (targetRows[0].role === "admin") {
      const [countRows]: any = await pool.query(
        `
        SELECT COUNT(*) AS admin_count FROM Users WHERE role = 'admin'
        `
      );
      const adminCount = Number(countRows[0]?.admin_count ?? 0);
      if (adminCount <= 1) {
        return NextResponse.json(
          { error: "Cannot delete the last admin account" },
          { status: 400 }
        );
      }
    }

    const [deleteResult]: any = await pool.query(
      `
      DELETE FROM Users WHERE user_id = ?
      `,
      [userId]
    );

    if (deleteResult.affectedRows === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
