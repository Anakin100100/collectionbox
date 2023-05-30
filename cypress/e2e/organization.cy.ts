describe("Organization page", () => {
  it("should show the name of the organization", async () => {
    cy.visit("http://localhost:3000/dashboard/organization")

    cy.get("#welcome-paragraph").should("contain.text", `Welcome TestOrg`)
  })

  it("should be not visible to user that doesn't have an organization", () => {
    cy.setCookie(
      "next-auth.session-token",
      "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..myX5qy6M4slYbbpg.iwU3gkez_XMP_P74nUfKcxG-XdSnZkXY1A8ywfSkcd1SqACAyXMnn5NWxazHUAy3rlRSaOTJu52II2yeX7Ck5-NDJgarzc7Hf-bAmW9AVFsKJuSqwD-BDJjukqWBhv1TvmC4BWyq7VMcK9HG6-8lce_XbOoSDYB4PA8SvDrOUFMrc_LA6KPDdFgwogl-gA6tRfYfGjKwSkW5w4tXBmuMwJSnwuMig7nrB9aKQ4fdYyc.wiYcgpAAqWOvI3i2ItF2ew"
    )

    cy.visit("http://localhost:3000/dashboard/organization")

    cy.get("#no-organization-alert").should(
      "contain.text",
      `You are not an admin of an Organization.`
    )
  })
})
export {}
