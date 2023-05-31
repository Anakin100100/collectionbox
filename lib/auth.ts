import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import EmailProvider from "next-auth/providers/email"
import GitHubProvider from "next-auth/providers/github"

const env = require("@/env")

import { db } from "@/lib/db"

import sgMail from "@sendgrid/mail"

sgMail.setApiKey(env.SENDGRID_API_KEY)

export const authOptions: NextAuthOptions = {
  // huh any! I know.
  // This is a temporary fix for prisma client.
  // @see https://github.com/prisma/prisma/issues/16117
  adapter: PrismaAdapter(db as any),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GitHubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
    EmailProvider({
      from: env.SMTP_FROM,
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        const user = await db.user.findUnique({
          where: {
            email: identifier,
          },
          select: {
            emailVerified: true,
          },
        })

        // Simple sign-in and sign-up email templates
        const signInTemplate = `
          <html>
          <body>
            <h1>Welcome Back</h1>
            <p>Please click the link below to sign in to your account:</p>
            <a href="${url}">Sign In</a>
          </body>
          </html>
        `

        const signUpTemplate = `
          <html>
          <body>
            <h1>Activate your account</h1>
            <p>Please click the link below to activate your account:</p>
            <a href="${url}">Activate Account</a>
          </body>
          </html>
        `

        const emailTemplate = user?.emailVerified
          ? signInTemplate
          : signUpTemplate

        const msg = {
          to: identifier,
          from: provider.from as string,
          subject: user?.emailVerified ? "Sign In" : "Activate your account",
          html: emailTemplate,
          headers: {
            // Set this to prevent Gmail from threading emails.
            // See https://stackoverflow.com/questions/23434110/force-emails-not-to-be-grouped-into-conversations/25435722.
            "X-Entity-Ref-ID": new Date().getTime() + "",
          },
        }

        try {
          await sgMail.send(msg)
        } catch (error) {
          console.error(error)

          if (error.response) {
            console.error(error.response.body)
          }

          throw new Error("Failed to send email")
        }
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture
      }

      return session
    },
    async jwt({ token, user }) {
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      })

      if (!dbUser) {
        if (user) {
          token.id = user?.id
        }
        return token
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      }
    },
  },
  debug: true,
}
