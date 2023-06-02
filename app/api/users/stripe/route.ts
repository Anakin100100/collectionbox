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

    const stripeSession = await stripe.checkout.sessions.create(
      {
        success_url: billingUrl,
        cancel_url: billingUrl,
        payment_method_types: ["card"],
        mode: "payment",
        billing_address_collection: "auto",
        customer_email: session.user.email,
        payment_intent_data: {
          application_fee_amount: body.ammount * 100 * 0.04,
        },
        line_items: [
          {
            price_data: {
              unit_amount: body.ammount * 100,
              currency: "usd",
              product_data: {
                name: "Donation",
              },
            },
            quantity: 1,
          },
        ],
        metadata: {
          userId: session.user.id,
        },
      },
      {
        stripeAccount: collectionBoxWithOrganization?.organization.stripeId,
      }
    )

    return new Response(JSON.stringify({ url: stripeSession.url }))
  } catch (error) {
    console.log(`Error has occured: ${error}`)
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}
