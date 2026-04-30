// ─── Selectors ────────────────────────────────────────────────────────────────
const SEL = {
  tabAL: '[data-testid="standings-tab-al"]',
  tabNL: '[data-testid="standings-tab-nl"]',
  table: '[data-testid="standings-table"]',
  divisionName: '[data-testid="standings-division-name"]',
  row: '[data-testid="standings-row"]',
}

// ─── Page Object ──────────────────────────────────────────────────────────────
export const StandingsPage = {
  visit: () => cy.visit('/standings'),
  tabAL: () => cy.get(SEL.tabAL),
  tabNL: () => cy.get(SEL.tabNL),
  clickAL: () => cy.get(SEL.tabAL).click(),
  clickNL: () => cy.get(SEL.tabNL).click(),
  tables: () => cy.get(SEL.table),
  divisionNames: () => cy.get(SEL.divisionName),
  rows: () => cy.get(SEL.row),
}
