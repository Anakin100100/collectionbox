import Stripe from "stripe"

const env = require("@/env")

export const stripe = new Stripe(env.STRIPE_API_KEY, {
  apiVersion: "2022-11-15",
  typescript: true,
})
