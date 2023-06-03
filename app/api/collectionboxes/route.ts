import { getServerSession } from "next-auth/next"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { collectionBoxCreateSchema } from "@/lib/validations/collectionBox"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    const { user } = session
    const collectionBoxes = await db.collectionBox.findMany({
      select: {
        id: true,
        title: true,
        createdAt: true,
      },
      where: {
        userId: user.id,
      },
    })

    return new Response(JSON.stringify(collectionBoxes))
  } catch (error) {
    return new Response(null, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    const json = await req.json()
    const body = collectionBoxCreateSchema.parse(json)

    const collectionBox = await db.collectionBox.create({
      data: {
        title: body.title,
        content: body.content,
        userId: session.user.id,
        organizationId: body.organizationId,
      },
      select: {
        id: true,
      },
    })

    return new Response(JSON.stringify(collectionBox))
  } catch (error) {
    console.log(`An error has occured: ${error}`)
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}
