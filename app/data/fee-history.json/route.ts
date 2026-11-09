import { historyJson } from "@/lib/dataset";

export const dynamic = "force-static";

export function GET() {
  return Response.json(historyJson(), { headers: { "Access-Control-Allow-Origin": "*" } });
}
