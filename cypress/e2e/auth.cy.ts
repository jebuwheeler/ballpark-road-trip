import { LoginPage } from '../pages/LoginPage'
import { SignupPage } from '../pages/SignupPage'

describe('Login', () => {
  beforeEach(() => LoginPage.visit())

  it('renders the login form', () => {
    LoginPage.form().should('be.visible')
    cy.get('[data-testid="login-email"]').should('be.visible')
    cy.get('[data-testid="login-password"]').should('be.visible')
    cy.get('[data-testid="login-submit"]').should('be.visible')
  })

  it('shows error on invalid credentials', () => {
    LoginPage.login('notauser@example.com', 'wrongpassword')
    LoginPage.error().should('be.visible')
  })

  it('signup link navigates to signup page', () => {
    LoginPage.signupLink().click()
    cy.url().should('include', '/signup')
  })
})

describe('Signup', () => {
  beforeEach(() => SignupPage.visit())

  it('renders the signup form', () => {
    SignupPage.form().should('be.visible')
    cy.get('[data-testid="signup-email"]').should('be.visible')
    cy.get('[data-testid="signup-password"]').should('be.visible')
    cy.get('[data-testid="signup-confirm"]').should('be.visible')
    cy.get('[data-testid="signup-submit"]').should('be.visible')
  })

  it('shows error when passwords do not match', () => {
    SignupPage.fillEmail('test@example.com')
    SignupPage.fillPassword('password123')
    SignupPage.fillConfirm('different123')
    SignupPage.submit()
    SignupPage.error().should('be.visible').and('contain', 'do not match')
  })

  it('login link navigates to login page', () => {
    SignupPage.loginLink().click()
    cy.url().should('include', '/login')
  })
})

describe('Protected routes', () => {
  it('redirects unauthenticated users from /trips to /login', () => {
    cy.visit('/trips')
    cy.url().should('include', '/login')
  })
})
