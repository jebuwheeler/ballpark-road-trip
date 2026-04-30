// ─── Selectors ────────────────────────────────────────────────────────────────
const SEL = {
  refresh: '[data-testid="scores-refresh"]',
  loading: '[data-testid="scores-loading"]',
  error: '[data-testid="scores-error"]',
  empty: '[data-testid="scores-empty"]',
  sectionLive: '[data-testid="scores-section-live"]',
  sectionFinal: '[data-testid="scores-section-final"]',
  sectionUpcoming: '[data-testid="scores-section-upcoming"]',
  card: '[data-testid="score-card"]',
  gameStatus: '[data-testid="game-status"]',
  gameVenue: '[data-testid="game-venue"]',
  awayTeam: '[data-testid="away-team"]',
  homeTeam: '[data-testid="home-team"]',
}

// ─── Page Object ──────────────────────────────────────────────────────────────
export const ScoresPage = {
  visit: () => cy.visit('/scores'),
  waitForLoad: () => cy.get(SEL.loading).should('not.exist'),
  clickRefresh: () => cy.get(SEL.refresh).click(),
  cards: () => cy.get(SEL.card),
  error: () => cy.get(SEL.error),
  empty: () => cy.get(SEL.empty),
  sectionLive: () => cy.get(SEL.sectionLive),
  sectionFinal: () => cy.get(SEL.sectionFinal),
  sectionUpcoming: () => cy.get(SEL.sectionUpcoming),
  firstCard: {
    status: () => cy.get(SEL.card).first().find(SEL.gameStatus),
    venue: () => cy.get(SEL.card).first().find(SEL.gameVenue),
    awayTeam: () => cy.get(SEL.card).first().find(SEL.awayTeam),
    homeTeam: () => cy.get(SEL.card).first().find(SEL.homeTeam),
  },
}
