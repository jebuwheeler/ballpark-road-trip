import { StandingsPage } from '../pages/StandingsPage'
import { NavPage } from '../pages/NavPage'

describe('Standings', () => {
  beforeEach(() => StandingsPage.visit())

  it('renders page header', () => {
    cy.contains('h1', 'Standings').should('be.visible')
  })

  it('active nav link is Standings', () => {
    NavPage.linkStandings().should('have.class', 'bg-red-600')
  })

  it('AL and NL tabs are present, AL active by default', () => {
    StandingsPage.tabAL().should('be.visible').and('have.class', 'bg-red-600')
    StandingsPage.tabNL().should('be.visible').and('not.have.class', 'bg-red-600')
  })

  it('shows AL division tables by default', () => {
    StandingsPage.tables().should('have.length.greaterThan', 0)
    StandingsPage.divisionNames().first().invoke('text').should('match', /AL/)
  })

  it('switching to NL tab shows NL divisions', () => {
    StandingsPage.clickNL()
    StandingsPage.tabNL().should('have.class', 'bg-red-600')
    StandingsPage.divisionNames().first().invoke('text').should('match', /NL/)
  })

  it('each division table has team rows', () => {
    StandingsPage.rows().should('have.length.greaterThan', 0)
  })

  it('NL tab also has team rows', () => {
    StandingsPage.clickNL()
    StandingsPage.rows().should('have.length.greaterThan', 0)
  })
})
