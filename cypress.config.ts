import { defineConfig } from "cypress"

const nodemailer = require("nodemailer")
const Imap = require("imap")
const simpleParser = require("mailparser").simpleParser
import { db } from "@/lib/db"

async function makeEmailAccount() {
  const testAccount = await nodemailer.createTestAccount()

  const imapConfig = {
    user: testAccount.user,
    password: testAccount.pass,
    host: "imap.ethereal.email",
    port: 993,
    tls: true,
    authTimeout: 10000,
  }

  const userEmail = {
    email: testAccount.user,
    async getLastEmail() {
      return new Promise((resolve, reject) => {
        try {
          const imap = new Imap(imapConfig)
          imap.once("ready", () => {
            imap.openBox("INBOX", false, () => {
              imap.search(["UNSEEN", ["SINCE", new Date()]], (err, results) => {
                const f = imap.fetch(results, { bodies: "" })
                f.on("message", (msg) => {
                  msg.on("body", (stream) => {
                    simpleParser(stream, async (err, parsed) => {
                      resolve(parsed)
                    })
                  })
                  msg.once("attributes", (attrs) => {
                    const { uid } = attrs
                    imap.addFlags(uid, ["\\Seen"], () => {
                      console.log("Marked as read!")
                    })
                  })
                })
                f.once("error", (error) => {
                  console.error(error)
                  return resolve(null)
                })
                f.once("end", () => {
                  console.log("Done fetching all messages!")
                  imap.end()
                })
              })
            })
          })
          imap.once("error", (err) => {
            console.error(err)
            return resolve(null)
          })
          imap.once("end", () => console.log("Connection ended"))
          imap.connect()
        } catch (ex) {
          console.log("an error occurred")
        }
      })
    },
  }
  return userEmail
}

async function setupNodeEvents(on, config) {
  const emailAccount = await makeEmailAccount()
  on("task", {
    getUserEmail: () => emailAccount.email,
    getLastEmail: async () => {
      const lastEmail = await emailAccount.getLastEmail()
      return lastEmail
    },
    addOrgToUser: async ({ email }) => {
      const user = await db.user.findFirst({ where: { email: email } })
      const updatedUser = await db.user.update({
        //@ts-expect-error
        where: { id: user.id },
        data: { isOrgAdmin: true },
      })
      const organization = await db.organization.create({
        data: {
          name: "AcmeCharity",
          adminId: updatedUser.id,
          stripeId: "acct_1N8LGfKE8acZIhT8",
        },
      })

      return { user: updatedUser, organization: organization }
    },
  })
}

export default defineConfig({
  e2e: {
    setupNodeEvents,
  },
  defaultCommandTimeout: 6000,
  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
})
