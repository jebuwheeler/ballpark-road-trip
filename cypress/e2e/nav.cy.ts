import { NavPage } from '../pages/NavPage'

describe('Navigation', () => {
  it('renders nav with logo and all links on the home page', () => {
    cy.visit('/')
    NavPage.nav().should('be.visible')
    NavPage.logo().should('be.visible').and('contain', 'Ballpark Road Trip')
    NavPage.linkMap().should('be.visible')
    NavPage.linkScores().should('be.visible')
    NavPage.linkStandings().should('be.visible')
    NavPage.linkTeams().should('be.visible')
    NavPage.linkTrips().should('be.visible')
  })

  it('highlights the active link', () => {
    cy.visit('/scores')
    NavPage.linkScores().should('have.class', 'bg-red-600')
    NavPage.linkMap().should('not.have.class', 'bg-red-600')
  })

  it('logo navigates to home', () => {
    cy.visit('/scores')
    NavPage.logo().click()
    cy.url().should('eq', Cypress.config('baseUrl') + '/')
  })

  it('nav links navigate to correct pages', () => {
    cy.visit('/')
    NavPage.linkStandings().click()
    cy.url().should('include', '/standings')

    NavPage.linkTeams().click()
    cy.url().should('include', '/teams')

    NavPage.linkScores().click()
    cy.url().should('include', '/scores')
  })

  it('mobile menu toggles open and closed', () => {
    cy.viewport(375, 812)
    cy.visit('/')
    NavPage.mobileMenu().should('not.exist')
    NavPage.openMobileMenu()
    NavPage.mobileMenu().should('be.visible')
    NavPage.openMobileMenu()
    NavPage.mobileMenu().should('not.exist')
  })

  it('mobile menu closes after navigating', () => {
    cy.viewport(375, 812)
    cy.visit('/')
    NavPage.openMobileMenu()
    NavPage.mobileLinkScores().click()
    NavPage.mobileMenu().should('not.exist')
    cy.url().should('include', '/scores')
  })
})
