import { DashboardConfig } from "types"

export const dashboardConfig: DashboardConfig = {
  sidebarNav: [
    {
      title: "CollectionBoxes",
      href: "/dashboard",
      icon: "collectionBox",
      id: "collectionBoxesDashboardButton",
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: "settings",
      id: "settingsDashboardButton",
    },
    {
      title: "Organization",
      href: "/dashboard/organization",
      icon: "organization",
      id: "organizationDashboardButton",
    },
  ],
}
