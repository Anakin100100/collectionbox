import { db } from "@/lib/db"

import { z } from "zod"

const verifyUserHasAccountSchema = z.object({
  email: z.string(),
})

export async function POST(req: Request) {
  const json = await req.json()
  const body = verifyUserHasAccountSchema.parse(json)

  const user = await db.user.findFirst({ where: { email: body.email } })

  const headers = new Headers({
    "Cache-Control": "no-cache",
  })
  if (user === null) {
    return new Response(JSON.stringify({ result: false }), {
      status: 200,
      headers: headers,
    })
  } else {
    return new Response(JSON.stringify({ result: true }), {
      status: 200,
      headers: headers,
    })
  }
}
