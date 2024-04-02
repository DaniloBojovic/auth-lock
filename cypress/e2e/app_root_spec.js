describe("App root", () => {
  it("should display root div", () => {
    cy.visit("http://localhost:4200");
    cy.get("app-root").should("be.visible");
  });

  it("should navigate to /login page", () => {
    // Navigate to the /login route
    cy.visit("http://localhost:4200/login");

    // Assert that the current URL is /login
    cy.url().should("include", "/login");
  });

  // it("should navigate to the /user-list route", () => {
  //   // Perform login
  //   cy.login("admin0", "password0").then(() => {
  //     // Navigate to the /user-list route
  //     cy.visit("http://localhost:4200/user-list");

  //     // Assert that the current URL is /user-list
  //     cy.url().should("include", "/user-list");
  //   });
  // });
});
