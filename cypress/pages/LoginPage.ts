// ─── Selectors ────────────────────────────────────────────────────────────────
const SEL = {
  form: '[data-testid="login-form"]',
  email: '[data-testid="login-email"]',
  password: '[data-testid="login-password"]',
  submit: '[data-testid="login-submit"]',
  error: '[data-testid="login-error"]',
  signupLink: 'a[href="/signup"]',
}

// ─── Page Object ──────────────────────────────────────────────────────────────
export const LoginPage = {
  visit: () => cy.visit('/login'),
  form: () => cy.get(SEL.form),
  fillEmail: (email: string) => cy.get(SEL.email).clear().type(email),
  fillPassword: (password: string) => cy.get(SEL.password).clear().type(password),
  submit: () => cy.get(SEL.submit).click(),
  error: () => cy.get(SEL.error),
  signupLink: () => cy.get(SEL.signupLink),
  login: (email: string, password: string) => {
    cy.get(SEL.email).clear().type(email)
    cy.get(SEL.password).clear().type(password)
    cy.get(SEL.submit).click()
  },
}
