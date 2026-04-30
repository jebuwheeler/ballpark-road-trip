/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      login(email?: string, password?: string): Chainable<void>
    }
  }
}

Cypress.Commands.add('login', (email?: string, password?: string) => {
  cy.fixture('testUser').then((user) => {
    const e = email ?? user.email
    const p = password ?? user.password

    cy.session([e, p], () => {
      cy.visit('/login')
      cy.get('[data-testid="login-email"]').type(e)
      cy.get('[data-testid="login-password"]').type(p)
      cy.get('[data-testid="login-submit"]').click()
      cy.url().should('include', '/trips')
    })
  })
})

export {}
