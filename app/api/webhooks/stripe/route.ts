import { headers } from "next/headers"
import Stripe from "stripe"

import { db } from "@/lib/db"
import { stripe } from "@/lib/stripe"

const env = require("@/env")

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get("Stripe-Signature") as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    )
  } catch (error) {
    return new Response(`Webhook Error: ${error.message}`, { status: 400 })
  }

  const session = event.data.object as Stripe.Checkout.Session

  if (event.type === "checkout.session.completed") {
    // The data there cannot be null
    await db.donation.create({
      data: {
        // @ts-expect-error
        userId: session.metadata.userId,
        // @ts-expect-error
        collectionBoxId: session.metadata.collectionBoxId,
        // @ts-expect-error
        ammount: Math.floor(session.amount_total / 100),
      },
    })
  }

  return new Response(null, { status: 200 })
}
