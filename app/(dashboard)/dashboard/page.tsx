import { redirect } from "next/navigation"

import { MemoCollectionBoxCreateForm } from "@/components/collection-box-create-button"
import { CollectionBoxItem } from "@/components/collection-box-item"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

export const metadata = {
  title: "Dashboard",
}

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const collectionBoxes = await db.collectionBox.findMany({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
      title: true,
      createdAt: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  })

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Collection Boxes"
        text="Create and manage Collection Boxes"
      >
        <MemoCollectionBoxCreateForm />
      </DashboardHeader>
      <div>
        {collectionBoxes?.length ? (
          <div className="divide-y divide-border rounded-md border">
            {collectionBoxes.map((collectionBox) => (
              <CollectionBoxItem
                key={collectionBox.id}
                collectionBox={collectionBox}
              />
            ))}
          </div>
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="collectionBox" />
            <EmptyPlaceholder.Title>
              No Collection Boxes created
            </EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              You don&apos;t have any Collection Boxes yet.
            </EmptyPlaceholder.Description>
          </EmptyPlaceholder>
        )}
      </div>
    </DashboardShell>
  )
}
