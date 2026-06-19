import { cookies } from "next/headers";
import { createHash } from "crypto";

const COOKIE_NAME = "baigessence_admin";
const SESSION_MAX_AGE = 60 * 60 * 24; // 24 hours

function getSecret(): string {
  return process.env.ADMIN_SECRET || "baigessence-dev-secret";
}

function getPassword(): string {
  return process.env.ADMIN_PASSWORD || "baigessence2026";
}

function createToken(): string {
  const payload = `${getPassword()}:${getSecret()}`;
  return createHash("sha256").update(payload).digest("hex");
}

export async function verifyAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return token === createToken();
}

export function getSessionCookie(token: string) {
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: SESSION_MAX_AGE,
    path: "/",
  };
}

export function validatePassword(password: string): boolean {
  return password === getPassword();
}

export function generateSessionToken(): string {
  return createToken();
}

export function getClearSessionCookie() {
  return {
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 0,
    path: "/",
  };
}
