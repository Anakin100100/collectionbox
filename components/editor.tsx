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
  collectionBox: Pick<
    CollectionBox,
    // @ts-expect-error
    "id" | "content" | "totalDonations" | "description" | "organizationName"
  >
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
    const QuoteTool = (await import("@editorjs/quote")).default
    const CheckistTool = (await import("@editorjs/checklist")).default
    const ImageToolClass = (await import("editorjs-inline-image")).default
    const ColorToolClass = (await import("editorjs-text-color-plugin")).default

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
          list: List,
          table: Table,
          embed: Embed,
          quote: QuoteTool,
          checklist: CheckistTool,
          image: {
            class: ImageToolClass,
            inlineToolbar: true,
            config: {
              embed: {
                display: true,
              },
              unsplash: {
                appName: "CollectionBox",
                clientId: "oBLRXxxbBnr0w6Sycn8l198YbkTDRkNFgW0oSZ_e-Ng",
              },
            },
          },
          Color: {
            class: ColorToolClass,
            config: {
              colorCollections: [
                "#EC7878",
                "#9C27B0",
                "#673AB7",
                "#3F51B5",
                "#0070FF",
                "#03A9F4",
                "#00BCD4",
                "#4CAF50",
                "#8BC34A",
                "#CDDC39",
                "#FFF",
              ],
              defaultColor: "#FF1300",
              type: "text",
              customPicker: true, // add a button to allow selecting any colour
            },
          },
          Marker: {
            class: ColorToolClass, // if load from CDN, please try: window.ColorPlugin
            config: {
              defaultColor: "#FFBF00",
              type: "marker",
              icon: `<svg fill="#000000" height="200px" width="200px" version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M17.6,6L6.9,16.7c-0.2,0.2-0.3,0.4-0.3,0.6L6,23.9c0,0.3,0.1,0.6,0.3,0.8C6.5,24.9,6.7,25,7,25c0,0,0.1,0,0.1,0l6.6-0.6 c0.2,0,0.5-0.1,0.6-0.3L25,13.4L17.6,6z"></path> <path d="M26.4,12l1.4-1.4c1.2-1.2,1.1-3.1-0.1-4.3l-3-3c-0.6-0.6-1.3-0.9-2.2-0.9c-0.8,0-1.6,0.3-2.2,0.9L19,4.6L26.4,12z"></path> </g> <g> <path d="M28,29H4c-0.6,0-1-0.4-1-1s0.4-1,1-1h24c0.6,0,1,0.4,1,1S28.6,29,28,29z"></path> </g> </g></svg>`,
            },
          },
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
    <div className="container mt-4 grid w-full gap-4">
      <div className="flex justify-center">
        <DonationForm
          className={""}
          collectionBoxId={collectionBox.id}
          description={collectionBox.description}
          organizationName={collectionBox.organizationName}
        />
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
        <div className="flex-row space-x-2">
          <button
            onClick={handleSubmit(onSubmit)}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              componentVisibility,
              "px-2"
            )}
          >
            {isSaving && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save
            <Icons.save className="ml-2 h-4 w-4" />
          </button>
          <button
            className={cn(buttonVariants({ variant: "ghost" }), "px-2")}
            onClick={() => {
              navigator.clipboard.writeText(
                `${process.env.NEXT_PUBLIC_APP_URL}/editor/${collectionBox.id}`
              )
              toast({
                description: "Collection box url copied to clipboard",
              })
            }}
          >
            Share
            <Icons.link className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
      <div>
        <div>
          <h1 className="text-center text-2xl font-bold">
            {`Raised ${collectionBox.totalDonations} USD`}
          </h1>
        </div>
      </div>
      <div className="prose prose-stone mx-auto dark:prose-invert">
        <div id="editor" />
      </div>
    </div>
  )
}
