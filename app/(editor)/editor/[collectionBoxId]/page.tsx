import { CollectionBox } from "@prisma/client"
import { notFound } from "next/navigation"

import { Editor } from "@/components/editor"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

async function getCollectionBoxesForUser(collectionBoxId: CollectionBox["id"]) {
  const res = await db.$queryRaw<
    {
      id: string
      content: object
      total_donations: number
      description: string
      organization_name: string
    }[]
  >`
      SELECT 
        collection_boxes.id, 
        collection_boxes.content, 
        COALESCE(SUM(donations.ammount), 0) AS total_donations,
        organizations.description,
        organizations.name AS organization_name
      FROM collection_boxes
      LEFT JOIN donations ON donations.collection_box_id = collection_boxes.id
      LEFT JOIN organizations ON collection_boxes.organization_id = organizations.id
      WHERE collection_boxes.id = ${collectionBoxId} AND collection_boxes.visible = true
      GROUP BY collection_boxes.id, organizations.description, organization_name;
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
        content: collectionBox.content,
        totalDonations: collectionBox.total_donations,
        description: collectionBox.description,
        organizationName: collectionBox.organization_name,
      }}
      readonly={readonly}
    />
  )
}
