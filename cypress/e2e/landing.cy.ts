describe("Navigation", () => {
  it("should navigate to the about page", () => {
    // Start from the index page
    cy.visit("http://localhost:3000/")

    // Find a link with an href attribute containing "about" and click it
    cy.get("#mainHeader").should(
      "contain.text",
      "We empower charities to raise funds fast on the internet."
    )
  })

  it("should go to /dahsboard for logged in user when Create One button is clicked", () => {
    cy.visit("http://localhost:3000/")
    cy.get("#createCollectionboxButton").click()
    cy.url().should("equal", "http://localhost:3000/dashboard")
  })

  it("should go to email to for logged in user when Contact us button is clicked", () => {
    cy.visit("http://localhost:3000/")
    cy.get("#contactUsButton").click()
    cy.url().should("equal", "http://localhost:3000/contact")
  })

  it("should list six features", () => {
    cy.visit("http://localhost:3000/")
    cy.get("#featuresGrid").children().should("have.length", 6)
  })
})

export {}
