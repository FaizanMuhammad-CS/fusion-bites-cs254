import { NextRequest, NextResponse } from "next/server";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

import pool from "@/src/lib/db";

type UserRow = RowDataPacket & { role: string };

async function countOtherAdmins(excludeUserId: number): Promise<number> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT COUNT(*) AS c FROM Users WHERE role = 'admin' AND user_id != ?`,
    [excludeUserId]
  );
  return Number(rows[0]?.c ?? 0);
}

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await ctx.params;
    const userId = Number(idParam);
    if (!Number.isFinite(userId) || userId <= 0) {
      return NextResponse.json({ error: "Invalid user id." }, { status: 400 });
    }

    const body = (await req.json()) as {
      name?: string;
      email?: string;
      password?: string;
      role?: string;
      phone?: string | null;
      address?: string;
    };

    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const address = body.address?.trim();
    const phoneRaw =
      body.phone === null || body.phone === undefined
        ? undefined
        : String(body.phone).trim();
    const phone = phoneRaw === undefined ? undefined : phoneRaw || null;
    const password = body.password?.trim();
    const role =
      body.role === "admin"
        ? "admin"
        : body.role === "customer"
          ? "customer"
          : undefined;

    const [existingRows] = await pool.query<UserRow[]>(
      `SELECT role FROM Users WHERE user_id = ? LIMIT 1`,
      [userId]
    );
    const existing = existingRows[0];
    if (!existing) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const nextRole = role ?? existing.role;
    if (existing.role === "admin" && nextRole === "customer") {
      const others = await countOtherAdmins(userId);
      if (others < 1) {
        return NextResponse.json(
          { error: "Cannot remove the last administrator." },
          { status: 400 }
        );
      }
    }

    if (name !== undefined && !name) {
      return NextResponse.json({ error: "Name cannot be empty." }, { status: 400 });
    }
    if (email !== undefined && !email) {
      return NextResponse.json({ error: "Email cannot be empty." }, { status: 400 });
    }
    if (address !== undefined && !address) {
      return NextResponse.json({ error: "Address cannot be empty." }, { status: 400 });
    }

    if (password !== undefined && password.length > 0) {
      const fields: string[] = [];
      const values: (string | number | null)[] = [];

      if (name !== undefined) {
        fields.push("name = ?");
        values.push(name);
      }
      if (email !== undefined) {
        fields.push("email = ?");
        values.push(email);
      }
      if (role !== undefined) {
        fields.push("role = ?");
        values.push(role);
      }
      if (phone !== undefined) {
        fields.push("phone = ?");
        values.push(phone);
      }
      if (address !== undefined) {
        fields.push("address = ?");
        values.push(address);
      }
      fields.push("password = ?");
      values.push(password);
      values.push(userId);

      await pool.query<ResultSetHeader>(
        `UPDATE Users SET ${fields.join(", ")} WHERE user_id = ?`,
        values
      );
    } else {
      const fields: string[] = [];
      const values: (string | number | null)[] = [];

      if (name !== undefined) {
        fields.push("name = ?");
        values.push(name);
      }
      if (email !== undefined) {
        fields.push("email = ?");
        values.push(email);
      }
      if (role !== undefined) {
        fields.push("role = ?");
        values.push(role);
      }
      if (phone !== undefined) {
        fields.push("phone = ?");
        values.push(phone);
      }
      if (address !== undefined) {
        fields.push("address = ?");
        values.push(address);
      }

      if (fields.length === 0) {
        return NextResponse.json({ ok: true });
      }

      values.push(userId);
      await pool.query<ResultSetHeader>(
        `UPDATE Users SET ${fields.join(", ")} WHERE user_id = ?`,
        values
      );
    }

    return NextResponse.json({ ok: true });
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
      { error: "Failed to update user." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await ctx.params;
    const userId = Number(idParam);
    if (!Number.isFinite(userId) || userId <= 0) {
      return NextResponse.json({ error: "Invalid user id." }, { status: 400 });
    }

    const [existingRows] = await pool.query<UserRow[]>(
      `SELECT role FROM Users WHERE user_id = ? LIMIT 1`,
      [userId]
    );
    const existing = existingRows[0];
    if (!existing) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    if (existing.role === "admin") {
      const others = await countOtherAdmins(userId);
      if (others < 1) {
        return NextResponse.json(
          { error: "Cannot delete the last administrator." },
          { status: 400 }
        );
      }
    }

    await pool.query<ResultSetHeader>(`DELETE FROM Users WHERE user_id = ?`, [
      userId,
    ]);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to delete user." },
      { status: 500 }
    );
  }
}
