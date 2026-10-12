import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "rz_admin";
const MAX_AGE = 60 * 60 * 12;

function secret() {
  const pw = process.env.ADMIN_PASSWORD;
  if (pw) return pw;
  // Solo en desarrollo local hay contraseña por defecto.
  return process.env.NODE_ENV === "production" ? null : "admin";
}

const sign = (value: string, key: string) => createHmac("sha256", key).update(value).digest("hex");

function safeEqual(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export function checkPassword(password: string) {
  const key = secret();
  return !!key && safeEqual(sign(password, "pw"), sign(key, "pw"));
}

export async function startSession() {
  const key = secret()!;
  const exp = String(Date.now() + MAX_AGE * 1000);
  (await cookies()).set(COOKIE, `${exp}.${sign(exp, key)}`, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: MAX_AGE });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin() {
  const key = secret();
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!key || !raw) return false;
  const [exp, sig] = raw.split(".");
  return !!exp && !!sig && Number(exp) > Date.now() && safeEqual(sig, sign(exp, key));
}

export const hasPasswordConfigured = () => secret() !== null;
