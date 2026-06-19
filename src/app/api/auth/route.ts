import { NextResponse } from "next/server";
import {
  validatePassword,
  generateSessionToken,
  getSessionCookie,
  getClearSessionCookie,
} from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    if (!validatePassword(password)) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const token = generateSessionToken();
    const response = NextResponse.json({ success: true });
    response.cookies.set(getSessionCookie(token));
    return response;
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(getClearSessionCookie());
  return response;
}
