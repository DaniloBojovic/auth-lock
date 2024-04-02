// describe("Registration Form", () => {
//   it("submits the form", () => {
//     // Visit the registration page
//     cy.visit("http://localhost:4200/register");

//     // Wait for the form to load
//     cy.wait(4000); // wait for 1000 milliseconds

//     // Fill in the form fields
//     cy.get("input[formControlName=username]").type("testuser");
//     cy.get("input[formControlName=email]").type("testuser@example.com");
//     cy.get("input[formControlName=password]").type("password11");
//     cy.get("input[formControlName=confirmPassword]").type("password11");
//     cy.get("input[formControlName=street]").type("123 Test St");
//     cy.get("input[formControlName=city]").type("Test City");
//     cy.get("input[formControlName=state]").type("Test State");
//     cy.get("input[formControlName=zip]").type("12345");

//     // Submit the form
//     cy.get("button[type=submit]").click();

//     // Verify the form submission
//     // This will depend on your application's behavior after form submission.
//     // For example, if it navigates to a new page, you can check the URL:
//     cy.pause();
//     cy.url().should("include", "/login");
//   });
// });
