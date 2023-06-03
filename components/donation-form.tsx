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

export function DonationForm({ className, collectionBoxId, ...props }) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [ammount, setAmmount] = React.useState<number>(10)

  function onSubmit(event) {
    console.log("moving to stripe checkout")

    const handleSubmit = async (event) => {
      event.preventDefault()
      setIsLoading(true)

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
            ammount: ammount,
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

    handleSubmit(event)
  }

  const handleAmmountChange = (event) => {
    const parsed = parseInt(event.target.value)
    if (event.target.value === "") {
      setAmmount(1)
      return
    }
    if (isNaN(parsed)) {
      return toast({
        title: "Invalid ammount",
        description: `${event.target.value} is not a valid number`,
        variant: "destructive",
      })
    }
    if (parsed < 0) {
      return toast({
        title: "Invalid ammount",
        description: `${event.target.value} must be positive`,
        variant: "destructive",
      })
    }

    setAmmount(parsed)
  }

  return (
    <div className={cn(className, "w-full")}>
      <Card>
        <CardHeader>
          <h1 className="text-center text-2xl">Donate Now</h1>
          <CardDescription className="text-center">
            Donate now to help starving children
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          Charity description Lorem ipsum dolor sit amet, consectetur adipiscing
          elit. Donec erat urna, vehicula vitae ornare nec, semper ut eros.
          Suspendisse potenti. Vestibulum ante ipsum primis in faucibus orci
          luctus et ultrices posuere cubilia curae; Etiam placerat mauris nec
          quam semper congue. Morbi laoreet vel mauris in volutpat. Etiam
          sagittis mauris tellus, non vehicula libero mattis non. Proin non nunc
          rutrum, rutrum massa ut, ullamcorper magna.
        </CardContent>
        <CardFooter className="flex flex-row justify-center">
          <div className="mr-2">
            <Input
              className="w-14"
              onChange={handleAmmountChange}
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
