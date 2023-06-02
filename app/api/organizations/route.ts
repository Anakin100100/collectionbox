import { db } from "@/lib/db"

export async function GET() {
  const organizations = await db.organization.findMany({
    select: { id: true, name: true },
  })

  return new Response(JSON.stringify(organizations), { status: 200 })
}
