import { ScoresPage } from '../pages/ScoresPage'
import { NavPage } from '../pages/NavPage'

describe('Scores', () => {
  beforeEach(() => ScoresPage.visit())

  it('renders page header and refresh button', () => {
    cy.contains('h1', 'Scores').should('be.visible')
    cy.get('[data-testid="scores-refresh"]').should('be.visible')
  })

  it('active nav link is Scores', () => {
    NavPage.linkScores().should('have.class', 'bg-red-600')
  })

  it('shows score cards or no-games message after loading', () => {
    ScoresPage.waitForLoad()
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="scores-empty"]').length) {
        ScoresPage.empty().should('be.visible')
      } else {
        ScoresPage.cards().should('have.length.greaterThan', 0)
      }
    })
  })

  it('each score card has status, venue, and team rows', () => {
    ScoresPage.waitForLoad()
    cy.get('[data-testid="scores-empty"]').then(($empty) => {
      if (!$empty.length) {
        ScoresPage.firstCard.status().should('exist')
        ScoresPage.firstCard.venue().should('exist')
        ScoresPage.firstCard.awayTeam().should('exist')
        ScoresPage.firstCard.homeTeam().should('exist')
      }
    })
  })

  it('refresh button re-fetches scores', () => {
    ScoresPage.waitForLoad()
    ScoresPage.clickRefresh()
    ScoresPage.waitForLoad()
  })
})
