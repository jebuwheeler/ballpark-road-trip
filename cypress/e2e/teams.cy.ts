import { TeamsPage } from '../pages/TeamsPage'
import { NavPage } from '../pages/NavPage'

describe('Teams', () => {
  beforeEach(() => TeamsPage.visit())

  it('renders page header', () => {
    cy.contains('h1', 'Teams').should('be.visible')
  })

  it('active nav link is Teams', () => {
    NavPage.linkTeams().should('have.class', 'bg-red-600')
  })

  it('shows all 30 team cards', () => {
    TeamsPage.cards().should('have.length', 30)
  })

  it('each card has a team name and abbreviation', () => {
    TeamsPage.cards().first().within(() => {
      cy.get('[data-testid="team-name"]').should('not.be.empty')
      cy.get('[data-testid="team-abbr"]').should('not.be.empty')
    })
  })

  it('clicking a team card navigates to team detail', () => {
    TeamsPage.cards().first().click()
    cy.url().should('match', /\/teams\/\d+/)
  })

  it('team detail page shows roster', () => {
    TeamsPage.clickCard('New York Yankees')
    cy.url().should('include', '/teams/')
    cy.contains('Roster').should('be.visible')
  })
})
