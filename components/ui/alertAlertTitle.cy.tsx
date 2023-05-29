import React from "react"

import { AlertTitle } from "./alert"

describe("<AlertTitle />", () => {
  it("renders", () => {
    cy.mount(
      <AlertTitle className="alterttitle">This is a demo app!</AlertTitle>
    )

    cy.get(".alterttitle").should("contains.text", "This is a demo app!")
  })
})
