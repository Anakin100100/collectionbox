export async function GET(req: Request) {
  await fetch("https://collectionbox.online", { cache: "no-cache" })
  await fetch("https://collectionbox.online/editor/cliinp4d00001jd08vlfhl7nm", {
    cache: "no-cache",
  })

  const headers = new Headers({
    "Cache-Control": "no-cache",
  })
  return new Response("ok", {
    status: 200,
    headers: headers,
  })
}
