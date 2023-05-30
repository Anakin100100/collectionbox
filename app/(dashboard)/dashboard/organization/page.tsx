import { redirect } from "next/navigation"

import { DashboardHeader } from "@/components/header"
import { Icons } from "@/components/icons"
import { DashboardShell } from "@/components/shell"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

export const metadata = {
  title: "Organization",
  description: "Manage your organization and your donations.",
}

export default async function OrganizationPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const dbUser = await db.user.findUnique({ where: { id: user.id } })
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

  const dbOrg = await db.organization.findFirst({
    where: { adminId: dbUser.id },
  })

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Billing"
        text="Manage billing and your subscription plan."
      />
      <div className="grid gap-8">
        <p id="welcome-paragraph">Welcome {dbOrg?.name}</p>
      </div>
    </DashboardShell>
  )
}
