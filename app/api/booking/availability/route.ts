import { getAvailability } from "@/lib/server/booking";
import { fail, handle, json } from "@/lib/server/http";

export const dynamic = "force-dynamic";

export const GET = handle(async (req: Request) => {
  const url = new URL(req.url);
  const { service, slots } = await getAvailability(url.searchParams.get("service") ?? "", url.searchParams.get("date") ?? "");
  if (!service) return fail("Servicio o fecha no válidos.");
  return json({ slots });
});
