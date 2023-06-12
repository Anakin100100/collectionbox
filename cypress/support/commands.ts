/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
// @ts-expect-error
Cypress.Commands.add("login", (email) => {
  cy.session(
    ["default"],
    () => {
      cy.visit("http://localhost:3000/login")
      cy.get("#email").type(email)
      cy.get("#signUpButton").click()
      cy.get("#successfulSignInToast")
        .find("#toastDescription")
        .should(
          "have.text",
          "We sent you a login link. Be sure to check your spam too."
        )
      cy.wait(5000)
      cy.task("getLastEmail")
        .its("html")
        .then((html) => {
          cy.document({ log: false }).invoke({ log: false }, "write", html)
        })
      cy.get("#signInText").should(
        "have.text",
        "Please click the link below to sign in to your account:"
      )
      cy.get("#signInLink").click()
      cy.url().should("contain", "http://localhost:3000/dashboard")
    },
    {
      cacheAcrossSpecs: true,
    }
  )
})

export {}
