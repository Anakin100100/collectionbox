describe("Organization page", () => {
  let userEmail

  before(() => {
    // get and check the test email only once before the tests
    cy.task("getUserEmail").then((email) => {
      expect(email).to.be.a("string")
      userEmail = email
    })
  })

  it("should be not visible to user that doesn't have an organization", () => {
    //@ts-expect-error
    cy.login(userEmail)
    cy.visit("http://localhost:3000/dashboard/organization")

    cy.get("#no-organization-alert").should(
      "contain.text",
      `You are not an admin of an Organization.`
    )
  })

  it("welcome org admin with an org name", () => {
    //@ts-expect-error
    cy.login(userEmail)
    cy.visit("http://localhost:3000/dashboard/organization")

    cy.get("#orgDashboardHeader").should("contain.text", `AcmeCharity`)
  })
})
export {}
