import { CollectionBox } from "@prisma/client"
import Link from "next/link"

import { CollectionBoxOperations } from "@/components/collection-box-operations"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDate } from "@/lib/utils"

interface CollectionBoxItemProps {
  collectionBox: Pick<CollectionBox, "id" | "title" | "createdAt">
}

export function CollectionBoxItem({ collectionBox }: CollectionBoxItemProps) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="grid gap-1">
        <Link
          href={`/editor/${collectionBox.id}`}
          className="font-semibold hover:underline"
        >
          {collectionBox.title}
        </Link>
        <div>
          <p className="text-sm text-muted-foreground">
            {formatDate(collectionBox.createdAt?.toDateString())}
          </p>
        </div>
      </div>
      <CollectionBoxOperations
        collectionBox={{ id: collectionBox.id, title: collectionBox.title }}
      />
    </div>
  )
}

CollectionBoxItem.Skeleton = function CollectionBoxItemSkeleton() {
  return (
    <div className="p-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  )
}
