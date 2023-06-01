"use client"

import * as React from "react"

import { UserSubscriptionPlan } from "types"
import { cn, formatDate } from "@/lib/utils"
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

interface DonationFormProps extends React.HTMLAttributes<HTMLFormElement> {}

export function DonationForm({ className, ...props }: DonationFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  async function onSubmit(event) {
    event.preventDefault()
    setIsLoading(!isLoading)

    // Get a Stripe session URL.
    const response = await fetch("/api/users/stripe")

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
        <CardFooter className="flex justify-center">
          <div>
            <button
              onClick={onSubmit}
              className={cn(buttonVariants(), "text-center")}
              disabled={isLoading}
            >
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Donate 5 USD
            </button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
