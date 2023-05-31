import { CollectionBoxCreateButton } from "@/components/collection-box-create-button"
import { CollectionBoxItem } from "@/components/collection-box-item"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"

export default function DashboardLoading() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Collection Boxes"
        text="Create and manage Collection Boxes."
      >
        <CollectionBoxCreateButton />
      </DashboardHeader>
      <div className="divide-border-200 divide-y rounded-md border">
        <CollectionBoxItem.Skeleton />
        <CollectionBoxItem.Skeleton />
        <CollectionBoxItem.Skeleton />
        <CollectionBoxItem.Skeleton />
        <CollectionBoxItem.Skeleton />
      </div>
    </DashboardShell>
  )
}
