/// <reference types="Cypress" />

describe("Home page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:8000");
  });

  it("renders header", function() {
    cy.contains("Automated dependency updates");
  });
});
