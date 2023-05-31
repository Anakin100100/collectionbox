import { CollectionBox, User } from "@prisma/client"
import { notFound, redirect } from "next/navigation"

import { Editor } from "@/components/editor"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

async function getCollectionBoxesForUser(
  collectionBoxId: CollectionBox["id"],
  userId: User["id"]
) {
  return await db.collectionBox.findFirst({
    where: {
      id: collectionBoxId,
      userId: userId,
    },
  })
}

interface EditorPageProps {
  params: { collectionBoxId: string }
}

export default async function EditorPage({ params }: EditorPageProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const collectionBox = await getCollectionBoxesForUser(
    params.collectionBoxId,
    user.id
  )

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
    />
  )
}
