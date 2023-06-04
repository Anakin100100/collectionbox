"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { Input } from "@/components/ui/input"

export function DonationForm({
  className,
  collectionBoxId,
  shortDescription,
  longDescription,
  ...props
}) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [ammount, setAmmount] = React.useState<string>("10")

  function onSubmit(event) {
    console.log("moving to stripe checkout")

    const handleSubmit = async () => {
      event.preventDefault()
      setIsLoading(true)

      const parsed = Number(ammount)

      if (isNaN(parsed)) {
        setIsLoading(false)
        return toast({
          title: "Invalid ammount",
          description: `${ammount} is not a valid number`,
          variant: "destructive",
        })
      }
      if (parsed <= 1) {
        setIsLoading(false)
        return toast({
          title: "Invalid ammount",
          description: `${ammount} must be more than 1 usd`,
          variant: "destructive",
        })
      }

      // Get a Stripe session URL.
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/users/stripe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            collectionBoxId: collectionBoxId,
            ammount: parsed,
          }),
        }
      )

      if (!response?.ok) {
        setIsLoading(false)
        return toast({
          title: "Something went wrong.",
          description: "Please refresh the page and try again.",
          variant: "destructive",
        })
      }

      // Redirect to the Stripe session.
      // This could be a checkout page for initial upgrade.
      // Or portal to manage existing subscription.
      const session = await response.json()
      if (session) {
        window.location.href = session.url
      }
    }

    handleSubmit()
  }

  return (
    <div className={cn(className, "w-full")}>
      <Card>
        <CardHeader>
          <h1 className="text-center text-2xl">Donate Now</h1>
          <CardDescription className="text-center">
            {shortDescription}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">{longDescription}</CardContent>
        <CardFooter className="flex flex-row justify-center">
          <div className="mr-2">
            <Input
              className="w-14"
              onChange={(event) => {
                setAmmount(event.target.value)
              }}
              value={ammount}
            />
          </div>
          <div>
            <button
              onClick={onSubmit}
              className={cn(buttonVariants(), "h-10 px-2 text-center")}
              disabled={isLoading}
            >
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Donate {ammount} USD
            </button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
