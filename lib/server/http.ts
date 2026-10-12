import { NextResponse } from "next/server";
import { isAdmin } from "./auth";

export const json = (data: unknown, status = 200) => NextResponse.json(data, { status });
export const fail = (error: string, status = 400) => NextResponse.json({ error }, { status });

export async function guard() {
  return (await isAdmin()) ? null : fail("Tu sesión expiró. Vuelve a iniciar sesión.", 401);
}

export function handle<A extends unknown[]>(fn: (...args: A) => Promise<Response>) {
  return async (...args: A) => {
    try {
      return await fn(...args);
    } catch (e) {
      console.error(e);
      return fail("No pudimos completar la operación. Inténtalo de nuevo en un momento.", 500);
    }
  };
}
