describe("Navigation", () => {
  it("should navigate to the about page", () => {
    // Start from the index page
    cy.visit("http://localhost:3000/")

    // Find a link with an href attribute containing "about" and click it
    cy.get("#mainHeader").should(
      "contain.text",
      "An example app built using Next.js 13 server components."
    )
  })
})

export {}
