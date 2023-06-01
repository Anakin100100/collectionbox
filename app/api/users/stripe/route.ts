import { getServerSession } from "next-auth/next"
import { z } from "zod"

import { proPlan } from "@/config/subscriptions"
import { authOptions } from "@/lib/auth"
import { stripe } from "@/lib/stripe"
import { absoluteUrl } from "@/lib/utils"

const billingUrl = absoluteUrl("/dashboard")

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || !session?.user.email) {
      return new Response(null, { status: 403 })
    }

    const stripeSession = await stripe.checkout.sessions.create(
      {
        success_url: billingUrl,
        cancel_url: billingUrl,
        payment_method_types: ["card"],
        mode: "payment",
        billing_address_collection: "auto",
        customer_email: session.user.email,
        line_items: [
          {
            price_data: {
              unit_amount: 500,
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
        stripeAccount: "{{CONNECTED_ACCOUNT_ID}}",
      }
    )

    return new Response(JSON.stringify({ url: stripeSession.url }))
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    console.log(`Stripe error has occured: ${error}`)
    return new Response(null, { status: 500 })
  }
}
