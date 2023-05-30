import { MainNav } from "@/components/main-nav"
import { DocsSidebarNav } from "@/components/sidebar-nav"
import { docsConfig } from "@/config/docs"
import { marketingConfig } from "@/config/marketing"
import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { UserAccountNav } from "@/components/user-account-nav"
import { getCurrentUser } from "@/lib/session"

interface DocsLayoutProps {
  children: React.ReactNode
}

export default async function DocsLayout({ children }: DocsLayoutProps) {
  const user = await getCurrentUser()
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-20 items-center space-x-4 sm:justify-between sm:space-x-0">
          <MainNav items={marketingConfig.mainNav}>
            <DocsSidebarNav items={docsConfig.sidebarNav} />
          </MainNav>
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
      <div className="container flex-1">{children}</div>
    </div>
  )
}
