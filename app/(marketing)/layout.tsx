import Link from "next/link"

import { MainNav } from "@/components/main-nav"
import { buttonVariants } from "@/components/ui/button"
import { marketingConfig } from "@/config/marketing"
import { cn } from "@/lib/utils"

import { UserAccountNav } from "@/components/user-account-nav"
import { getCurrentUser } from "@/lib/session"

interface MarketingLayoutProps {
  children: React.ReactNode
}

export default async function MarketingLayout({
  children,
}: MarketingLayoutProps) {
  const user = await getCurrentUser()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex w-full h-20 items-center space-x-4 justify-between sm:space-x-0">
          <MainNav items={marketingConfig.mainNav} />
          {(() => {
            if (!user) {
              return (
                <nav>
                  <Link
                    href="/login"
                    className={cn(
                      buttonVariants({ variant: "secondary", size: "sm" }),
                      "px-4"
                    )}
                  >
                    Login
                  </Link>
                </nav>
              )
            } else {
              return (
                <UserAccountNav
                  user={{
                    name: user.name,
                    image: user.image,
                    email: user.email,
                  }}
                />
              )
            }
          })()}
        </div>
      </header>
      <main className="container flex-1">{children}</main>
    </div>
  )
}
