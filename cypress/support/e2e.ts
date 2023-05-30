// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands"
// Alternatively you can use CommonJS syntax:
// require('./commands')

beforeEach(() => {
  /*
  const user = db.user.create({
    data: {
      name: "TestUser",
      email: "testuser@gmail.com",
      emailVerified: "2023-05-29T10:08:22.973Z",
    },
  })
  console.log(`Created user: ${user}`)
  */
  cy.setCookie(
    "next-auth.session-token",
    "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..qBlIIb13c8YEAQfF.F47hL-a_EgYKUHdIZM32e8FWCcB9zI3TiIIpptyigUytCRC3aNK1Mj2eH7THMwwKtP6Bt9A196abOK6LQAcxFG3fiLVHTKJP_uUOk7iL-BQxyNIkrGIObbAUKCcPPrNCq2H8VbGoBft4655cj23JyKCKgaL9ZmqLwzWCgDWxkMDJiU5mpxMw7FD-hypxTAh9h19wTC9Cq2i3KJQFtTax7AhurDKptjBE9cJCYlIQSw.0QDY4ZEaesewgNn3nP6flA"
  )
})
