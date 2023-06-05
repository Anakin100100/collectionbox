import { getServerSession } from "next-auth/next"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { collectionBoxCreateSchema } from "@/lib/validations/collectionBox"
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator"

const initial_collection_box = require("./initial_collection_box.json")

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
        content: initial_collection_box,
        userId: session.user.id,
        organizationId: body.organizationId,
        sillyName: uniqueNamesGenerator({
          dictionaries: [adjectives, colors, animals],
          separator: "-",
        }),
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
