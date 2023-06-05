import { db } from "@/lib/db"
import * as z from "zod"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET() {
  const organizations = await db.organization.findMany({
    select: { id: true, name: true },
  })

  const headers = new Headers({
    "Cache-Control": "no-cache",
  })
  return new Response(JSON.stringify(organizations), {
    status: 200,
    headers: headers,
  })
}

const organizationDescriptionPatchSchema = z.object({
  description: z.string(),
  organizationId: z.string().min(1),
})

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return new Response("Unauthorized", { status: 403 })
  }

  const json = await req.json()
  const body = organizationDescriptionPatchSchema.parse(json)

  const organization = await db.organization.findFirst({
    where: { id: body.organizationId },
  })
  if (organization === null) {
    return new Response("Organization does not exist", { status: 422 })
  }

  if (organization.adminId != session.user.id) {
    return new Response(
      "You cannot edit the description of another organization",
      { status: 422 }
    )
  }

  await db.organization.update({
    where: { id: organization.id },
    data: { description: body.description },
  })

  return new Response(null, { status: 200 })
}
