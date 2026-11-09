import { historyCsv } from "@/lib/dataset";

export const dynamic = "force-static";

export function GET() {
  return new Response(historyCsv(), {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": 'inline; filename="sellcalc-fee-history.csv"' },
  });
}
