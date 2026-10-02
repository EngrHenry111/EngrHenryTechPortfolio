import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Single-admin auth: ADMIN_PASSWORD unlocks the dashboard, and the session is
// an HMAC-signed expiry timestamp stored in an httpOnly cookie.
const COOKIE_NAME = "admin_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("Missing SESSION_SECRET (at least 32 characters). Add it to .env.local / Vercel env vars.");
  }
  return secret;
}

function sign(value) {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("base64url");
}

function safeEqual(a, b) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
}

export function checkPassword(input) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password || typeof input !== "string") return false;
  // Compare fixed-length hashes so the check doesn't leak the password length.
  const hash = (s) => crypto.createHash("sha256").update(s).digest("hex");
  return safeEqual(hash(input), hash(password));
}

export async function createSession() {
  const expires = String(Date.now() + MAX_AGE_SECONDS * 1000);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, `${expires}.${sign(expires)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function isAdmin() {
  const cookieStore = await cookies();
  const value = cookieStore.get(COOKIE_NAME)?.value;
  if (!value) return false;
  const [expires, signature] = value.split(".");
  if (!expires || !signature) return false;
  return safeEqual(signature, sign(expires)) && Number(expires) > Date.now();
}

// Call at the top of every admin page and server action — server actions are
// public HTTP endpoints, so each one must check auth itself.
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
