import { PostHog } from "posthog-node"

export default function PostHogClient() {
  console.log("posthog")
  console.log(process.env.NEXT_PUBLIC_POSTHOG_KEY)
  console.log(process.env.NEXT_PUBLIC_POSTHOG_HOST)
  const posthogClient = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  })
  return posthogClient
}
