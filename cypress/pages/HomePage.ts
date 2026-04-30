// ─── Selectors ────────────────────────────────────────────────────────────────
const SEL = {
  mapContainer: '.mapboxgl-map',
  marker: '[data-testid="stadium-marker"]',
}

// ─── Page Object ──────────────────────────────────────────────────────────────
export const HomePage = {
  visit: () => cy.visit('/'),
  map: () => cy.get(SEL.mapContainer),
  markers: () => cy.get(SEL.marker),
  markerByTeam: (abbr: string) => cy.get(`[data-testid="stadium-marker"][data-team="${abbr}"]`),
}
