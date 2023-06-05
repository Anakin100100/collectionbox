import { redirect } from "next/navigation"

import { DashboardHeader } from "@/components/header"
import { Icons } from "@/components/icons"
import { DashboardShell } from "@/components/shell"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

import { DollarSign, Users } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
  title: "Organization",
  description: "Manage your organization and your donations.",
}

export default async function OrganizationPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const dbUser = await db.user.findUnique({
    where: { id: user.id },
    include: { organization: true },
  })

  if (!dbUser?.isOrgAdmin) {
    return (
      <DashboardShell>
        <DashboardHeader
          heading="Organization"
          text="Manage your organization and your donations."
        />
        <div className="grid gap-8">
          <Alert className="!pl-14">
            <Icons.warning />
            <AlertTitle id="no-organization-alert">
              You are not an admin of an Organization.
            </AlertTitle>
            <AlertDescription>
              CollectionBox is an app where only approved charitable
              organizations can raise funds. We have a due dilligence process
              that ensures no funds collected on our platform are
              misappropriated. If your organization would like to start using
              CollectionBox be sure to email us using the{" "}
              <a
                href="/contact"
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-8"
              >
                contact form
              </a>
              .
            </AlertDescription>
          </Alert>
        </div>
      </DashboardShell>
    )
  }

  const orgStats = await db.$queryRaw<{ donations: number; donors: number }>`
    SELECT 
      COALESCE(SUM(donations.ammount), 0) as donations,
      COALESCE(COUNT(DISTINCT donations.user_id), 0) as donors
    FROM donations 
    LEFT JOIN collection_boxes ON collection_boxes.id = donations.collection_box_id
    WHERE organization_id = ${dbUser.organization?.id} AND donations.created_at > current_timestamp() - INTERVAL '1 month'
  `

  return (
    <DashboardShell>
      <DashboardHeader
        // @ts-expect-error
        heading={dbUser.organization?.name}
        text="Manage your organization and your donations."
      />
      <div className="grid gap-4 md:grid-cols-2 ">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${parseInt(orgStats[0].donors)}
            </div>
            <p className="text-xs text-muted-foreground">within last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Donors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              +{parseInt(orgStats[0].donors)}
            </div>
            <p className="text-xs text-muted-foreground">within last 30 days</p>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
