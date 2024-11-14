import { openF1db } from "@/utils/f1db";

export async function GET(req: Request, res: Response) {
  const db = await openF1db();

  const items = await db.all("SELECT * FROM driver");

  return new Response(JSON.stringify(items), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
}