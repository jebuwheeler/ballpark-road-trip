// ─── Selectors ────────────────────────────────────────────────────────────────
const SEL = {
  card: '[data-testid="team-card"]',
  teamName: '[data-testid="team-name"]',
  teamAbbr: '[data-testid="team-abbr"]',
}

// ─── Page Object ──────────────────────────────────────────────────────────────
export const TeamsPage = {
  visit: () => cy.visit('/teams'),
  cards: () => cy.get(SEL.card),
  cardByName: (name: string) => cy.get(SEL.teamName).contains(name).closest(SEL.card),
  clickCard: (name: string) => cy.get(SEL.teamName).contains(name).closest(SEL.card).click(),
}
