import { MainNav } from "@/components/main-nav"
import { DocsSidebarNav } from "@/components/sidebar-nav"
import { docsConfig } from "@/config/docs"
import { marketingConfig } from "@/config/marketing"

interface DocsLayoutProps {
  children: React.ReactNode
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-20 items-center space-x-4 sm:justify-between sm:space-x-0">
          <MainNav items={marketingConfig.mainNav}>
            <DocsSidebarNav items={docsConfig.sidebarNav} />
          </MainNav>
        </div>
      </header>
      <div className="container flex-1">{children}</div>
    </div>
  )
}
