import Link from "next/link"

import { Icons } from "@/components/icons"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const metadata = {
  title: "Contact",
}

export default function ContactPage() {
  return (
    <section className="container flex flex-col gap-6 px-6 py-4 md:py-12 lg:py-24">
      <div className="mx-auto flex w-full flex-col items-center gap-4">
        <h2 className="text-center font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
          Reach out to talk with a founder
        </h2>
      </div>
      <div className="grid w-full items-start gap-10 rounded-lg border p-2 md:grid-cols-[1fr_200px] md:p-10">
        <div className="grid justify-center gap-6">
          <h3 className="text-center text-xl font-bold sm:text-2xl">
            Our contact information
          </h3>
          <ul className="grid items-center gap-3 text-sm text-muted-foreground sm:grid-cols-2">
            <li className="flex items-center">
              <Icons.email className="mr-2 h-4 w-4" />
              pawelbiegun@collectionbox.online
            </li>
            <li className="flex items-center">
              <Icons.phoneNumber className="mr-2 h-4 w-4" />
              +48 661 657 642
            </li>
            <li className="flex items-center">
              <Icons.address className="mr-2 h-4 w-4" />
              Makowa 19 Żywiec 34-300 Poland
            </li>
            <li className="flex items-center">
              <Icons.linkedin className="mr-2 h-4 w-4" />
              coming soon
            </li>
            <li className="flex items-center">
              <Icons.facebook className="mr-2 h-4 w-4" />
              coming soon
            </li>
            <li className="flex items-center">
              <Icons.instagram className="mr-2 h-4 w-4" />
              coming soon
            </li>
          </ul>
        </div>
        <div className="flex flex-col gap-4 text-center">
          <div>
            <h4 className="text-3xl font-bold">
              We respond as soon as possible
            </h4>
          </div>
          <Link
            href="mailto: pawelbiegun@collectionbox.online"
            className={cn(buttonVariants({ size: "lg" }))}
          >
            Contact us
          </Link>
        </div>
      </div>
    </section>
  )
}
