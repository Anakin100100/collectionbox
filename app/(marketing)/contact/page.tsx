import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export const metadata = {
  title: "About",
}

export default function PricingPage() {
  return (
    <section className="container flex flex-col  gap-6 py-8 md:max-w-[64rem] md:py-12 lg:py-24">
      <div className="mx-auto flex w-full flex-col items-center gap-4 md:max-w-[58rem]">
        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl ">
          Reach out to talk with a founder
        </h2>
      </div>
      <div className="grid w-full items-start gap-10 rounded-lg border p-10 md:grid-cols-[1fr_200px]">
        <div className="grid gap-6">
          <h3 className="text-xl font-bold sm:text-2xl">
            Our contact information
          </h3>
          <ul className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
            <li className="flex items-center">
              <Icons.email className="mr-2 h-4 w-4" />
              someemail@collectionbox.online
            </li>
            <li className="flex items-center">
              <Icons.phoneNumber className="mr-2 h-4 w-4" />
              some phone number
            </li>
            <li className="flex items-center">
              <Icons.address className="mr-2 h-4 w-4" />
              some address
            </li>
            <li className="flex items-center">
              <Icons.linkedin className="mr-2 h-4 w-4" />
              linkedin account
            </li>
            <li className="flex items-center">
              <Icons.facebook className="mr-2 h-4 w-4" />
              facebook account
            </li>
            <li className="flex items-center">
              <Icons.instagram className="mr-2 h-4 w-4" />
              an instagram account
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
            href="mailto: abc@example.com"
            className={cn(buttonVariants({ size: "lg" }))}
          >
            Contact us
          </Link>
        </div>
      </div>
    </section>
  )
}
