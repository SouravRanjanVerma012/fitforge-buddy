describe('FitBuddy Smoke Test', () => {
  it('shows login form and logs in', () => {
    cy.visit('/login');
    cy.get('input[type=email]').type('test@example.com');
    cy.get('input[type=password]').type('password123');
    cy.get('button[type=submit]').click();
    // After login, should see dashboard or main app content
    cy.contains('Welcome back').should('exist');
  });
}); 