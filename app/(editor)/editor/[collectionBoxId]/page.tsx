import { CollectionBox, User } from "@prisma/client"
import { notFound, redirect } from "next/navigation"

import { Editor } from "@/components/editor"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

async function getCollectionBoxesForUser(collectionBoxId: CollectionBox["id"]) {
  return await db.collectionBox.findFirst({
    where: {
      id: collectionBoxId,
    },
  })
}

interface EditorPageProps {
  params: { collectionBoxId: string }
}

export default async function EditorPage({ params }: EditorPageProps) {
  const user = await getCurrentUser()

  var readonly = false

  if (!user) {
    readonly = true
  }

  const collectionBox = await getCollectionBoxesForUser(params.collectionBoxId)

  if (!collectionBox) {
    notFound()
  }

  return (
    <Editor
      collectionBox={{
        id: collectionBox.id,
        title: collectionBox.title,
        content: collectionBox.content,
        published: collectionBox.published,
      }}
      readonly={readonly}
    />
  )
}
