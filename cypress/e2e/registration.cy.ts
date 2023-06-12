describe("Registration", () => {
  let userEmail

  before(() => {
    // get and check the test email only once before the tests
    cy.task("getUserEmail").then((email) => {
      expect(email).to.be.a("string")
      userEmail = email
    })
  })

  it("sends confirmation code", () => {
    cy.clearCookie("next-auth.session-token")
    cy.visit("http://localhost:3000/")
    cy.get("#createCollectionboxButton").click()
    cy.url().should("contain", "http://localhost:3000/login")
    cy.get("#createAccountButton").click()
    cy.url().should("contain", "http://localhost:3000/register")
    cy.get("#email").type(userEmail)
    cy.get("#signUpButton").click()
    cy.get("#consentNotObtainedToast")
      .find("#toastDescription")
      .should(
        "have.text",
        "You have to agree to our privacy policy and terms of service before you register."
      )
    cy.get("#consent").click()
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
    cy.get("#signUpText").should(
      "have.text",
      "Please click the link below to activate your account:"
    )
    cy.get("#signUpLink").click()
    cy.url().should("contain", "http://localhost:3000/dashboard")
    cy.get("#avatarDropdown").click()
    cy.get("#signOutButton").click()
    cy.get("#collectionBoxesDashboardButton").click()
    cy.url().should("contain", "http://localhost:3000/login")

    //@ts-expect-error
    cy.login(userEmail)
  })
})

export {}
