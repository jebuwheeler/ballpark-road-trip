// ─── Selectors ────────────────────────────────────────────────────────────────
const SEL = {
  form: '[data-testid="signup-form"]',
  email: '[data-testid="signup-email"]',
  password: '[data-testid="signup-password"]',
  confirm: '[data-testid="signup-confirm"]',
  submit: '[data-testid="signup-submit"]',
  error: '[data-testid="signup-error"]',
  success: '[data-testid="signup-success"]',
  loginLink: 'a[href="/login"]',
}

// ─── Page Object ──────────────────────────────────────────────────────────────
export const SignupPage = {
  visit: () => cy.visit('/signup'),
  form: () => cy.get(SEL.form),
  fillEmail: (email: string) => cy.get(SEL.email).clear().type(email),
  fillPassword: (password: string) => cy.get(SEL.password).clear().type(password),
  fillConfirm: (password: string) => cy.get(SEL.confirm).clear().type(password),
  submit: () => cy.get(SEL.submit).click(),
  error: () => cy.get(SEL.error),
  success: () => cy.get(SEL.success),
  loginLink: () => cy.get(SEL.loginLink),
}
