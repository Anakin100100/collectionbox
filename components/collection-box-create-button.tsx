"use client"

import { useRouter } from "next/navigation"
import * as React from "react"

import { ButtonProps, buttonVariants } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

interface CollectionBoxCreateButtonProps extends ButtonProps {}

export function CollectionBoxCreateButton({
  className,
  variant,
  size,
  ...props
}: CollectionBoxCreateButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  async function onClick() {
    setIsLoading(true)

    const response = await fetch("/api/collectionboxes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Untitled Collection Box",
      }),
    })

    setIsLoading(false)

    if (!response?.ok) {
      if (response.status === 402) {
        return toast({
          title: "Limit of 3 Collection Boxes reached.",
          description: "Please upgrade to the PRO plan.",
          variant: "destructive",
        })
      }

      return toast({
        title: "Something went wrong.",
        description: "Your Collection Box was not created. Please try again.",
        variant: "destructive",
      })
    }

    const collectionBox = await response.json()

    // This forces a cache invalidation.
    router.refresh()

    router.push(`/editor/${collectionBox.id}`)
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        buttonVariants({ variant, size }),
        {
          "cursor-not-allowed opacity-60 break-normal": isLoading,
        },
        className
      )}
      disabled={isLoading}
      {...props}
    >
      New Collection Box
    </button>
  )
}
