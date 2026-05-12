import {
  NextRequest,
  NextResponse,
} from "next/server";

import pool from "@/src/lib/db";

export async function POST(
  request: NextRequest
) {

  try {

    const body =
      await request.json();

    const {
      email,
      password,
    } = body;

    const [rows]: any =
      await pool.query(
        `
        SELECT
          user_id,
          name,
          email,
          role
        FROM Users
        WHERE email = ?
        AND password = ?
        LIMIT 1
        `,
        [email, password]
      );

    if (rows.length === 0) {

      return NextResponse.json(
        {
          error:
            "Invalid credentials",
        },
        {
          status: 401,
        }
      );
    }

    const user = rows[0];

    return NextResponse.json({
      success: true,
      user,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Login failed",
      },
      {
        status: 500,
      }
    );
  }
}