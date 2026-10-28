describe('OrangeHRM Login Intercept Test Suite', () => {

  beforeEach(() => {
    // Intercept 1: Memantau request konfigurasi client saat halaman login dimuat
    cy.intercept('GET', '**/web/index.php/core/i18n/messages').as('getMessages');
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    cy.wait('@getMessages');
  });

  it('TC-INT-001: Success login with valid credentials using intercept auth', () => {
    // Intercept 2: Memantau request POST saat tombol login diklik (proses otentikasi)
    cy.intercept('POST', '**/web/index.php/auth/validate').as('loginRequest');

    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();

    // Menunggu request intercept login selesai
    cy.wait('@loginRequest').its('response.statusCode').should('eq', 302);
    
    // Assertion dashboard
    cy.url().should('include', '/dashboard');
  });

  it('TC-INT-002: Failed login with invalid password', () => {
    // Intercept 3: Memantau request untuk endpoint action login gagal
    cy.intercept('POST', '**/web/index.php/auth/validate').as('failedLogin');

    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('wrongpass');
    cy.get('button[type="submit"]').click();

    cy.wait('@failedLogin');
    cy.get('.oxd-alert-content-text').should('have.text', 'Invalid credentials');
  });

  it('TC-INT-003: Failed login with invalid username', () => {
    // Intercept 4: Memantau request API dashboard/auth gagal
    cy.intercept('POST', '**/web/index.php/dashboard/index*').as('dashboardCheck');

    cy.get('input[name="username"]').type('SalahUser');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();

    cy.get('.oxd-alert-content-text').should('be.visible');
  });

  it('TC-INT-004: Verify Forgot Password link navigation intercept', () => {
    // Intercept 5: Memantau request halaman reset password
    cy.intercept('GET', '**/web/index.php/auth/requestPasswordResetCode').as('resetPassword');

    cy.get('.orangehrm-login-forgot-header').click();

    cy.url().should('include', '/requestPasswordResetCode');
  });

  it('TC-INT-005: Intercept asset image logo on login page', () => {
    // Intercept 6: Memantau pemuatan asset logo perusahaan/branding
    cy.intercept('GET', '**/web/images/ohrm-small-logo.png').as('getLogo');

    cy.get('.orangehrm-login-branding > img').should('be.visible');
  });

  it('TC-INT-006: Intercept employee action/view API stubbing test', () => {
    // Intercept 7: Memantau request data employees/candidates di backend demo
    cy.intercept('GET', '**/web/index.php/api/v2/core/employees*').as('getEmployees');

    // Melakukan login dulu untuk masuk ke area yang mentrigger API employees
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    
    cy.url().should('include', '/dashboard');
  });

  it('TC-INT-007: Verify input attribute type password with intercept check', () => {
    // Intercept 8: Memantau request endpoint auth web index
    cy.intercept('GET', '**/web/index.php/auth/login').as('getLoginPage');

    cy.get('input[name="password"]').should('have.attr', 'type', 'password');
  });

  it('TC-INT-008: Verify empty username validation message', () => {
    // Intercept 9: Memantau request umum web client
    cy.intercept('GET', '**/web/index.php/core/images/orangehrm-logo.png').as('getBrandLogo');

    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();

    cy.get('.oxd-input-group').eq(0).find('.oxd-input-field-error-message')
      .should('have.text', 'Required');
  });

});