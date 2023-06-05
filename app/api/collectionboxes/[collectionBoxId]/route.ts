import { getServerSession } from "next-auth"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { collectionBoxPatchSchema } from "@/lib/validations/collectionBox"

const routeContextSchema = z.object({
  params: z.object({
    collectionBoxId: z.string(),
  }),
})

export async function DELETE(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    // Validate the route params.
    const { params } = routeContextSchema.parse(context)

    // Check if the user has access to this Collection Box.
    if (
      !(await verifyCurrentUserHasAccessToCollectionBox(params.collectionBoxId))
    ) {
      return new Response(null, { status: 403 })
    }

    // Delete the Collection Box.
    await db.collectionBox.update({
      where: {
        id: params.collectionBoxId as string,
      },
      data: {
        visible: false,
      },
    })

    return new Response(null, { status: 204 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    // Validate route params.
    const { params } = routeContextSchema.parse(context)

    // Check if the user has access to this Collection Box.
    if (
      !(await verifyCurrentUserHasAccessToCollectionBox(params.collectionBoxId))
    ) {
      return new Response(null, { status: 403 })
    }

    // Get the request body and validate it.
    const json = await req.json()
    const body = collectionBoxPatchSchema.parse(json)

    // Update the Collection Box.
    // TODO: Implement sanitization for content.
    await db.collectionBox.update({
      where: {
        id: params.collectionBoxId,
      },
      data: {
        content: body.content,
      },
    })

    return new Response(null, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}

async function verifyCurrentUserHasAccessToCollectionBox(
  collectionBoxId: string
) {
  const session = await getServerSession(authOptions)
  const count = await db.collectionBox.count({
    where: {
      id: collectionBoxId,
      userId: session?.user.id,
    },
  })

  return count > 0
}
