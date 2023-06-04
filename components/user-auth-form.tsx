"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { userAuthSchema } from "@/lib/validations/auth"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import Link from "next/link"
import { Switch } from "@/components/ui/switch"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  page: "Sign In" | "Sign Up"
}

type FormData = z.infer<typeof userAuthSchema>

export function UserAuthForm({ className, page, ...props }: UserAuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userAuthSchema),
  })
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [hasConsented, setConsent] = React.useState<boolean>(false)
  const searchParams = useSearchParams()

  async function onSubmit(data: FormData) {
    if (hasConsented !== true && page !== "Sign In") {
      toast({
        title: "Consent not obtained.",
        description:
          "You have to agree to our privacy policy and terms of service before you register.",
        variant: "destructive",
      })

      return
    }
    setIsLoading(true)

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/users/accounts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
        }),
      }
    )
    const res: { result: boolean } = await response.json()

    if (page === "Sign In" && res.result === false) {
      toast({
        title: "No account detected",
        description: "Please register one using the link below the form",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    const signInResult = await signIn("email", {
      email: data.email.toLowerCase(),
      redirect: false,
      callbackUrl: searchParams?.get("from") || "/dashboard",
    })

    setIsLoading(false)

    if (!signInResult?.ok) {
      return toast({
        title: "Something went wrong.",
        description: "Your sign in request failed. Please try again.",
        variant: "destructive",
      })
    }

    return toast({
      title: "Check your email",
      description: "We sent you a login link. Be sure to check your spam too.",
    })
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              {...register("email")}
            />
            {errors?.email && (
              <p className="px-1 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
          <div
            className={cn(
              "my-2 flex items-center space-x-2",
              page === "Sign In" ? "hidden" : "visible"
            )}
          >
            <Switch
              id="consent"
              onClick={() => {
                setConsent(!hasConsented)
              }}
            />
            <Label htmlFor="consent">
              I agree to you agree to the{" "}
              <Link
                href="/terms"
                className="hover:text-brand underline underline-offset-4"
              >
                Terms of Service
              </Link>{" "}
              and the{" "}
              <Link
                href="/privacy"
                className="hover:text-brand underline underline-offset-4"
              >
                Privacy Policy
              </Link>
              .
            </Label>
          </div>
          <button className={cn(buttonVariants())} disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {`${page} with Email`}
          </button>
        </div>
      </form>
    </div>
  )
}
