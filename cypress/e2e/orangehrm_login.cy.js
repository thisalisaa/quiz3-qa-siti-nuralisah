describe('OrangeHRM Login Feature Test Suite', () => {

  beforeEach(() => {
    // Membuka halaman login OrangeHRM sebelum setiap test case dijalankan
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  });

  it('TC-LOG-001: Success login with valid credentials', () => {
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();

    // Assertion
    cy.url().should('include', '/dashboard');
    cy.get('.oxd-topbar-header-title').should('contain', 'Dashboard');
  });

  it('TC-LOG-002: Failed login with invalid password', () => {
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('wrongpass');
    cy.get('button[type="submit"]').click();

    // Assertion
    cy.get('.oxd-alert-content-text')
      .should('be.visible')
      .and('have.text', 'Invalid credentials');
  });

  it('TC-LOG-003: Failed login with invalid username', () => {
    cy.get('input[name="username"]').type('WrongUser');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();

    // Assertion
    cy.get('.oxd-alert-content-text')
      .should('be.visible')
      .and('have.text', 'Invalid credentials');
  });

  it('TC-LOG-004: Failed login with invalid username and password', () => {
    cy.get('input[name="username"]').type('WrongUser');
    cy.get('input[name="password"]').type('wrongpass');
    cy.get('button[type="submit"]').click();

    // Assertion
    cy.get('.oxd-alert-content-text')
      .should('be.visible')
      .and('have.text', 'Invalid credentials');
  });

  it('TC-LOG-005: Failed login with empty username', () => {
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();

    // Assertion
    cy.get('.oxd-input-group').eq(0).find('.oxd-input-field-error-message')
      .should('be.visible')
      .and('have.text', 'Required');
  });

  it('TC-LOG-006: Failed login with empty password', () => {
    cy.get('input[name="username"]').type('Admin');
    cy.get('button[type="submit"]').click();

    // Assertion
    cy.get('.oxd-input-group').eq(1).find('.oxd-input-field-error-message')
      .should('be.visible')
      .and('have.text', 'Required');
  });

  it('TC-LOG-007: Failed login with empty username and password', () => {
    cy.get('button[type="submit"]').click();

    // Assertion
    cy.get('.oxd-input-field-error-message')
      .should('have.length', 2)
      .each(($el) => {
        cy.wrap($el).should('be.visible').and('have.text', 'Required');
      });
  });

  it('TC-LOG-008: Login test with lowercase username (Case Sensitivity test)', () => {
    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();

    // Assertion
    cy.url().should('include', '/dashboard');
  });

  it('TC-LOG-009: Verify placeholder text exists on username input', () => {
    cy.get('input[name="username"]').should('have.attr', 'placeholder');
  });

  it('TC-LOG-010: Verify login button is enabled and clickable', () => {
    cy.get('button[type="submit"]').should('be.visible').and('not.be.disabled');
  });

  it('TC-LOG-011: Verify UI elements presence on login page', () => {
    // Assertion UI Elements
    cy.get('input[name="username"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
    cy.get('.orangehrm-login-branding > img').should('be.visible');
  });

  it('TC-LOG-012: Verify Password field input masking', () => {
    // Assertion password field type is 'password'
    cy.get('input[name="password"]').should('have.attr', 'type', 'password');
  });

});