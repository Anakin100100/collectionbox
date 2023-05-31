"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"
import { SidebarNavItem } from "types"

interface DashboardNavProps {
  items: SidebarNavItem[]
}

export function DashboardNav({ items }: DashboardNavProps) {
  const path = usePathname()

  if (!items?.length) {
    return null
  }

  return (
    <nav className="flex w-full justify-between lg:grid lg:items-start lg:gap-2">
      {items.map((item, index) => {
        const Icon = Icons[item.icon || "arrowRight"]
        return (
          item.href && (
            <Link key={index} href={item.disabled ? "/" : item.href}>
              <span
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  path === item.href ? "bg-accent" : "transparent",
                  item.disabled && "cursor-not-allowed opacity-80"
                )}
              >
                <Icon className="mr-0 h-4 w-4 lg:mr-2" />
                <span className="hidden w-0 lg:visible lg:block lg:w-auto">
                  {item.title}
                </span>
              </span>
            </Link>
          )
        )
      })}
    </nav>
  )
}
