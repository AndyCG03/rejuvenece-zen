export class AuthError extends Error {}

export async function api<T = unknown>(url: string, init?: RequestInit & { body?: string }): Promise<T> {
  const res = await fetch(url, { ...init, headers: { "Content-Type": "application/json", ...init?.headers } });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401) throw new AuthError(data.error);
  if (!res.ok) throw new Error(data.error ?? "Algo salió mal. Inténtalo de nuevo.");
  return data as T;
}

export const send = (url: string, method: string, body?: unknown) => api(url, { method, body: body === undefined ? undefined : JSON.stringify(body) });

export const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
