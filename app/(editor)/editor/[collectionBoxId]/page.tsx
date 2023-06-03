import { CollectionBox, User } from "@prisma/client"
import { notFound, redirect } from "next/navigation"

import { Editor } from "@/components/editor"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

async function getCollectionBoxesForUser(collectionBoxId: CollectionBox["id"]) {
  const res = await db.$queryRaw<
    {
      id: string
      content: object
      title: string
      total_donations: number
      short_description: string
      long_description: string
    }[]
  >`
      SELECT 
        collection_boxes.id, 
        collection_boxes.content, 
        collection_boxes.title, 
        COALESCE(SUM(donations.ammount), 0) AS total_donations,
        organizations.long_description,
        organizations.short_description
      FROM collection_boxes
      LEFT JOIN donations ON donations.collection_box_id = collection_boxes.id
      LEFT JOIN organizations ON collection_boxes.organization_id = organizations.id
      WHERE collection_boxes.id = ${collectionBoxId}
      GROUP BY collection_boxes.id, organizations.long_description, organizations.short_description;
    `
  return res[0]
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
        totalDonations: collectionBox.total_donations,
        shortDescription: collectionBox.short_description,
        longDescription: collectionBox.long_description,
      }}
      readonly={readonly}
    />
  )
}
