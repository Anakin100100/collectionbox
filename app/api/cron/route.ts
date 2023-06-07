export async function POST(req: Request) {
  const res1 = await fetch("https://collectionbox.online", {
    cache: "no-cache",
  })
  console.log(await res1.text())
  const res2 = await fetch(
    "https://collectionbox.online/editor/cliinp4d00001jd08vlfhl7nm",
    {
      cache: "no-cache",
    }
  )
  console.log(await res2.text())

  const headers = new Headers({
    "Cache-Control": "no-cache",
  })
  return new Response("ok", {
    status: 200,
    headers: headers,
  })
}
