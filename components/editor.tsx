"use client"

import EditorJS from "@editorjs/editorjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { CollectionBox } from "@prisma/client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import * as React from "react"
import { useForm } from "react-hook-form"
import TextareaAutosize from "react-textarea-autosize"
import * as z from "zod"

import { Icons } from "@/components/icons"
import { buttonVariants } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { collectionBoxPatchSchema } from "@/lib/validations/collectionBox"
import { DonationForm } from "./donation-form"
import "@/styles/editor.css"

interface EditorProps {
  collectionBox: Pick<CollectionBox, "id" | "title" | "content" | "published">
  readonly: boolean
}

type FormData = z.infer<typeof collectionBoxPatchSchema>

export function Editor({ collectionBox, readonly }: EditorProps) {
  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(collectionBoxPatchSchema),
  })
  const ref = React.useRef<EditorJS>()
  const router = useRouter()
  const [isSaving, setIsSaving] = React.useState<boolean>(false)
  const [isMounted, setIsMounted] = React.useState<boolean>(false)

  const initializeEditor = React.useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default
    const Header = (await import("@editorjs/header")).default
    const Embed = (await import("@editorjs/embed")).default
    const Table = (await import("@editorjs/table")).default
    const List = (await import("@editorjs/list")).default
    const LinkTool = (await import("@editorjs/link")).default

    const body = collectionBoxPatchSchema.parse(collectionBox)

    if (!ref.current) {
      const editor = new EditorJS({
        holder: "editor",
        onReady() {
          ref.current = editor
        },
        placeholder: "Type here to edit your Collection Box...",
        inlineToolbar: true,
        data: body.content,
        tools: {
          header: Header,
          linkTool: LinkTool,
          list: List,
          table: Table,
          embed: Embed,
        },
        readOnly: readonly,
        minHeight: 30,
      })
    }
  }, [collectionBox])

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true)
    }
  }, [])

  React.useEffect(() => {
    if (isMounted) {
      initializeEditor()

      return () => {
        ref.current?.destroy()
        ref.current = undefined
      }
    }
  }, [isMounted, initializeEditor])

  async function onSubmit(data: FormData) {
    setIsSaving(true)

    const blocks = await ref.current?.save()

    const response = await fetch(`/api/collectionboxes/${collectionBox.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: data.title,
        content: blocks,
      }),
    })

    setIsSaving(false)

    if (!response?.ok) {
      return toast({
        title: "Something went wrong.",
        description: "Your Collection Box was not saved. Please try again.",
        variant: "destructive",
      })
    }

    router.refresh()

    return toast({
      description: "Your CollectionBox has been saved.",
    })
  }

  if (!isMounted) {
    return null
  }

  var componentVisibility = "visible"
  if (readonly) {
    componentVisibility = "hidden"
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="container mt-4 grid w-full gap-10">
        <div className="flex justify-center">
          <DonationForm />
        </div>
        <div className="flex w-full items-center justify-between">
          <div>
            {((readonly) => {
              if (!readonly) {
                return (
                  <Link
                    href="/dashboard"
                    className={cn(buttonVariants({ variant: "ghost" }))}
                  >
                    <>
                      <Icons.chevronLeft className="mr-2 h-4 w-4" />
                      Back
                    </>
                  </Link>
                )
              } else {
                return (
                  <Link
                    href="/"
                    className={cn(buttonVariants({ variant: "ghost" }))}
                  >
                    <>
                      <Icons.logo className="mr-2 h-4 w-4" />
                      CollectionBox
                    </>
                  </Link>
                )
              }
            })(readonly)}
          </div>
          <div>
            <p
              className={cn(
                "text-sm text-muted-foreground",
                componentVisibility
              )}
            >
              {collectionBox.published ? "Published" : "Draft"}
            </p>
          </div>
          <div>
            <button
              type="submit"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                componentVisibility
              )}
            >
              {isSaving && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save
              <Icons.save className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="prose prose-stone mx-auto dark:prose-invert">
          <TextareaAutosize
            autoFocus
            id="title"
            defaultValue={collectionBox.title}
            placeholder="Collection Box title"
            className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
            {...register("title")}
          />
          <div id="editor" />
        </div>
      </div>
    </form>
  )
}
