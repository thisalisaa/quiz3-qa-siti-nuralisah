class LoginPage {
  visit() {
    cy.visit(
      "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login",
    );
  }

  fillUsername(username) {
    if (username) {
      cy.get('input[name="username"]').type(username);
    }
  }

  fillPassword(password) {
    if (password) {
      cy.get('input[name="password"]').type(password);
    }
  }

  clickLogin() {
    cy.get('button[type="submit"]').click();
  }

  login(username, password) {
    this.fillUsername(username);
    this.fillPassword(password);
    this.clickLogin();
  }

  verifyDashboard() {
    cy.url().should("include", "/dashboard");
    cy.get(".oxd-topbar-header-title").should("contain", "Dashboard");
  }

  verifyErrorMessage(message) {
    cy.get(".oxd-alert-content-text")
      .should("be.visible")
      .and("have.text", message);
  }

  verifyFieldError(message) {
    cy.get(".oxd-input-field-error-message")
      .should("be.visible")
      .and("have.text", message);
  }

  clickForgotPassword() {
    cy.get(".orangehrm-login-forgot-header").click();
  }
}

export default new LoginPage();
