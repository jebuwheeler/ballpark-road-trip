// ─── Selectors ────────────────────────────────────────────────────────────────
const SEL = {
  nav: '[data-testid="nav"]',
  logo: '[data-testid="nav-logo"]',
  linkMap: '[data-testid="nav-link-map"]',
  linkScores: '[data-testid="nav-link-scores"]',
  linkStandings: '[data-testid="nav-link-standings"]',
  linkTeams: '[data-testid="nav-link-teams"]',
  linkTrips: '[data-testid="nav-link-trips"]',
  mobileToggle: '[data-testid="nav-mobile-toggle"]',
  mobileMenu: '[data-testid="nav-mobile-menu"]',
  mobileLinkMap: '[data-testid="mobile-nav-link-map"]',
  mobileLinkScores: '[data-testid="mobile-nav-link-scores"]',
}

// ─── Page Object ──────────────────────────────────────────────────────────────
export const NavPage = {
  nav: () => cy.get(SEL.nav),
  logo: () => cy.get(SEL.logo),
  linkMap: () => cy.get(SEL.linkMap),
  linkScores: () => cy.get(SEL.linkScores),
  linkStandings: () => cy.get(SEL.linkStandings),
  linkTeams: () => cy.get(SEL.linkTeams),
  linkTrips: () => cy.get(SEL.linkTrips),
  mobileToggle: () => cy.get(SEL.mobileToggle),
  mobileMenu: () => cy.get(SEL.mobileMenu),
  openMobileMenu: () => cy.get(SEL.mobileToggle).click(),
  mobileLinkMap: () => cy.get(SEL.mobileLinkMap),
  mobileLinkScores: () => cy.get(SEL.mobileLinkScores),
}
