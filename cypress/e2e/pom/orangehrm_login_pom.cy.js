import LoginPage from "../../support/pages/LoginPage";

describe("OrangeHRM Login Test Suite using Page Object Model", () => {
  let data;

  beforeEach(() => {
    cy.fixture("orangeHRMData").then((fData) => {
      data = fData;
    });
    LoginPage.visit();
  });

  it("TC-POM-001: Success login with valid credentials", () => {
    LoginPage.login(data.validUser, data.validPass);
    LoginPage.verifyDashboard();
  });

  it("TC-POM-002: Failed login with invalid password", () => {
    LoginPage.login(data.validUser, data.invalidPass);
    LoginPage.verifyErrorMessage(data.errorMessage);
  });

  it("TC-POM-003: Failed login with invalid username", () => {
    LoginPage.login(data.invalidUser, data.validPass);
    LoginPage.verifyErrorMessage(data.errorMessage);
  });

  it("TC-POM-004: Failed login with invalid username and password", () => {
    LoginPage.login(data.invalidUser, data.invalidPass);
    LoginPage.verifyErrorMessage(data.errorMessage);
  });

  it("TC-POM-005: Failed login with empty username", () => {
    LoginPage.login("", data.validPass);
    LoginPage.verifyFieldError(data.requiredMessage);
  });

  it("TC-POM-006: Failed login with empty password", () => {
    LoginPage.login(data.validUser, "");
    LoginPage.verifyFieldError(data.requiredMessage);
  });

  it("TC-POM-007: Failed login with empty username and password", () => {
    LoginPage.clickLogin();
    cy.get(".oxd-input-field-error-message").should("have.length", 2);
  });

  it("TC-POM-008: Verify Forgot Password link redirection", () => {
    LoginPage.clickForgotPassword();
    cy.url().should("include", "/requestPasswordResetCode");
  });
});
