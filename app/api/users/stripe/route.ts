import { getServerSession } from "next-auth/next"
import { z } from "zod"

import { proPlan } from "@/config/subscriptions"
import { authOptions } from "@/lib/auth"
import { stripe } from "@/lib/stripe"
import { absoluteUrl } from "@/lib/utils"
import { db } from "@/lib/db"

const billingUrl = absoluteUrl("/dashboard")

const stripeCheckoutSessionCreateSchema = z.object({
  collectionBoxId: z.string(),
  ammount: z.number(),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || !session?.user.email) {
      return new Response(null, { status: 403 })
    }

    const json = await req.json()
    const body = stripeCheckoutSessionCreateSchema.parse(json)

    const collectionBoxWithOrganization = await db.collectionBox.findFirst({
      where: { id: body.collectionBoxId },
      include: {
        organization: true,
      },
    })

    const stripePaymentLink = await stripe.paymentLinks.create(
      {
        payment_method_types: ["card"],
        billing_address_collection: "auto",
        line_items: [
          {
            price: "price_1NEUrrIoMJBp2968Aiqkf9QN",
            quantity: body.ammount,
          },
        ],
        application_fee_percent: 4,
        metadata: {
          userId: session.user.id,
          email: session.user.email,
        },
      },
      {
        stripeAccount: collectionBoxWithOrganization?.organization.stripeId,
      }
    )

    return new Response(JSON.stringify({ url: stripePaymentLink.url }))
  } catch (error) {
    console.log(`Error has occured: ${error}`)
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}
