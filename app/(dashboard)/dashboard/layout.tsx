import { notFound } from "next/navigation"

import { MainNav } from "@/components/main-nav"
import { DashboardNav } from "@/components/nav"
import { UserAccountNav } from "@/components/user-account-nav"
import { dashboardConfig } from "@/config/dashboard"
import { marketingConfig } from "@/config/marketing"
import { getCurrentUser } from "@/lib/session"

interface DashboardLayoutProps {
  children?: React.ReactNode
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const user = await getCurrentUser()

  if (!user) {
    return notFound()
  }

  return (
    <div className="flex flex-col space-y-2 md:space-y-6">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex w-full h-20 items-center space-x-4 justify-between sm:space-x-0">
          <MainNav items={marketingConfig.mainNav} />
          <UserAccountNav
            user={{
              name: user.name,
              image: user.image,
              email: user.email,
            }}
          />
        </div>
      </header>
      <div className="container grid flex-1 gap-2 md:gap-12 md:grid-cols-[200px_1fr]">
        <aside className="max-h-content md:w-[200px] block">
          <DashboardNav items={dashboardConfig.sidebarNav} />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
