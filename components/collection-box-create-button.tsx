"use client"
import { useRouter } from "next/navigation"
import * as React from "react"
import { useState, useEffect } from "react"
import * as z from "zod"

import { ButtonProps, buttonVariants } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { collectionBoxCreateSchema } from "@/lib/validations/collectionBox"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"

interface CollectionBoxCreateFormProps extends ButtonProps {}

export const MemoCollectionBoxCreateForm = React.memo(
  function CollectionBoxCreateForm({
    className,
    variant,
    size,
    ...props
  }: CollectionBoxCreateFormProps) {
    const [open, setOpen] = useState<boolean>(false)
    const [value, setValue] = useState<{ id: string; name: string }>({
      name: "Select organization",
      id: "none",
    })
    const [organizations, setOrganizations] = useState<
      { id: string; name: string }[]
    >([])
    const router = useRouter()
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
      const fetchOrganizations = async () => {
        console.log("fetching organizations")
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/organizations`
        )
        const organizations = await response.json()
        console.log(organizations)
        setOrganizations(organizations)
      }

      fetchOrganizations()
    }, [])

    function handleSubmit() {
      const process = async () => {
        console.log("Creating new box")

        if (value.name === "Select organization") {
          return toast({
            title: "Please select an organization",
            description:
              "In order to create a Collection Box we must know which organization it belongs to.",
            variant: "destructive",
          })
        }

        setIsLoading(true)

        const response = await fetch("/api/collectionboxes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            organizationId: value.id,
          }),
        })

        setIsLoading(false)

        if (!response?.ok) {
          return toast({
            title: "Something went wrong.",
            description:
              "Your Collection Box was not created. Please try again.",
            variant: "destructive",
          })
        }

        const collectionBox = await response.json()

        // This forces a cache invalidation.
        router.refresh()

        router.push(`/editor/${collectionBox.id}`)
      }

      process()
    }

    return (
      <section className="flex flex-col justify-center space-y-2">
        <div className="w-full p-1">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full  justify-between"
              >
                {((value) => {
                  return (
                    <div className="m-1 flex flex-row items-center">
                      <div>
                        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                      </div>
                      <div>{value.name}</div>
                    </div>
                  )
                })(value)}
              </Button>
            </PopoverTrigger>
            <PopoverContent className=" p-0">
              <Command>
                <CommandInput placeholder="Search organization" />
                <CommandEmpty>No organization found</CommandEmpty>
                <CommandGroup>
                  {organizations.map((organization) => (
                    <CommandItem
                      key={organization.name}
                      onSelect={() => {
                        setValue(organization)
                        setOpen(false)
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value.id === organization.id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {organization.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <div className="w-full p-1">
          <button
            className={cn(
              buttonVariants({ variant, size }),
              {
                "cursor-not-allowed break-normal opacity-60": isLoading,
              },
              "w-full"
            )}
            disabled={isLoading}
            onClick={handleSubmit}
            {...props}
          >
            Create Collection Box
          </button>
        </div>
      </section>
    )
  }
)
