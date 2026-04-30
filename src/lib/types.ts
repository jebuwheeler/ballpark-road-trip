// ─── MLB API Types ────────────────────────────────────────────────────────────

export interface MLBTeam {
  id: number
  name: string
  abbreviation: string
  teamName: string
  locationName: string
  firstYearOfPlay: string
  league: { id: number; name: string }
  division: { id: number; name: string }
  venue: { id: number; name: string }
  springVenue?: { id: number; link: string }
  teamCode: string
  fileCode: string
  active: boolean
}

export interface MLBVenue {
  id: number
  name: string
  location?: {
    city: string
    state: string
    stateAbbrev: string
    defaultCoordinates?: {
      latitude: number
      longitude: number
    }
  }
  timeZone?: { id: string; offset: number; tz: string }
  active: boolean
  season?: string
}

export interface MLBPlayer {
  id: number
  fullName: string
  firstName: string
  lastName: string
  primaryNumber: string
  birthDate: string
  currentAge: number
  birthCity: string
  birthCountry: string
  height: string
  weight: number
  active: boolean
  currentTeam?: { id: number; name: string }
  primaryPosition: { code: string; name: string; type: string; abbreviation: string }
  batSide: { code: string; description: string }
  pitchHand: { code: string; description: string }
  stats?: MLBStatGroup[]
}

export interface MLBStatGroup {
  type: { displayName: string }
  group: { displayName: string }
  stats: Record<string, string | number>
}

export interface MLBRosterEntry {
  person: { id: number; fullName: string; link: string }
  jerseyNumber: string
  position: { code: string; name: string; type: string; abbreviation: string }
  status: { code: string; description: string }
  parentTeamId: number
}

export interface MLBGame {
  gamePk: number
  gameDate: string
  status: {
    abstractGameState: string  // "Preview" | "Live" | "Final"
    detailedState: string
    statusCode: string
  }
  teams: {
    away: MLBGameTeam
    home: MLBGameTeam
  }
  venue: { id: number; name: string }
  isTie?: boolean
  gameNumber: number
  doubleHeader: string
  seriesGameNumber: number
  seriesDescription: string
}

export interface MLBGameTeam {
  score?: number
  team: { id: number; name: string }
  isWinner?: boolean
  leagueRecord: { wins: number; losses: number; pct: string }
}

export interface MLBScheduleDate {
  date: string
  totalGames: number
  games: MLBGame[]
}

export interface MLBStandingRecord {
  standingsType: string
  league: { id: number; name: string }
  division: { id: number; name: string }
  sport: { id: number; link: string }
  lastUpdated: string
  teamRecords: MLBTeamRecord[]
}

export interface MLBTeamRecord {
  team: { id: number; name: string; link: string }
  season: string
  streak: { streakType: string; streakNumber: number; streakCode: string }
  divisionRank: string
  leagueRank: string
  wildCardRank: string
  row: number
  gamesBack: string
  wildCardGamesBack: string
  leagueGamesBack: string
  springLeagueGamesBack: string
  sportGamesBack: string
  divisionGamesBack: string
  wins: number
  losses: number
  pct: string
  runsAllowed: number
  runsScored: number
  divisionChamp: boolean
  divisionLeader: boolean
  wildCardLeader: boolean
  hasWildcard: boolean
  clinched: boolean
  eliminationNumber: string
  wildCardEliminationNumber: string
  magicNumber: string
  winningPercentage: string
  records: Record<string, unknown>
}

// ─── Enriched / App-Level Types ───────────────────────────────────────────────

export interface Stadium {
  venueId: number
  venueName: string
  teamId: number
  teamName: string
  teamAbbr: string
  city: string
  state: string
  lat: number
  lng: number
  /** CSS hex color, e.g. "#003087" */
  primaryColor: string
  secondaryColor: string
}

// ─── Supabase / Database Types ────────────────────────────────────────────────

export interface Trip {
  id: string
  user_id: string
  name: string
  description: string | null
  created_at: string
  updated_at: string
  stops?: TripStop[]
}

export interface TripStop {
  id: string
  trip_id: string
  venue_id: number
  venue_name: string
  team_name: string
  team_abbr: string
  city: string
  state: string
  lat: number
  lng: number
  stop_order: number
  visited: boolean
  game_date: string | null
  game_pk: number | null
}

export type TripStopInsert = Omit<TripStop, 'id'>
export type TripInsert = Omit<Trip, 'id' | 'created_at' | 'updated_at' | 'stops'>

// ─── Team color map (MLB primary colors) ─────────────────────────────────────
// Source: official MLB brand guidelines, widely published

export const TEAM_COLORS: Record<string, { primary: string; secondary: string }> = {
  ARI: { primary: '#A71930', secondary: '#E3D4AD' },
  ATL: { primary: '#CE1141', secondary: '#13274F' },
  BAL: { primary: '#DF4601', secondary: '#000000' },
  BOS: { primary: '#BD3039', secondary: '#0C2340' },
  CHC: { primary: '#0E3386', secondary: '#CC3433' },
  CWS: { primary: '#27251F', secondary: '#C4CED4' },
  CIN: { primary: '#C6011F', secondary: '#000000' },
  CLE: { primary: '#00385D', secondary: '#E31937' },
  COL: { primary: '#333366', secondary: '#C4CED4' },
  DET: { primary: '#0C2340', secondary: '#FA4616' },
  HOU: { primary: '#002D62', secondary: '#EB6E1F' },
  KC:  { primary: '#004687', secondary: '#C09A5B' },
  LAA: { primary: '#BA0021', secondary: '#003263' },
  LAD: { primary: '#005A9C', secondary: '#EF3E42' },
  MIA: { primary: '#00A3E0', secondary: '#EF3340' },
  MIL: { primary: '#FFC52F', secondary: '#12284B' },
  MIN: { primary: '#002B5C', secondary: '#D31145' },
  NYM: { primary: '#002D72', secondary: '#FF5910' },
  NYY: { primary: '#003087', secondary: '#C4CED4' },
  OAK: { primary: '#003831', secondary: '#EFB21E' },
  PHI: { primary: '#E81828', secondary: '#002D72' },
  PIT: { primary: '#FDB827', secondary: '#27251F' },
  SD:  { primary: '#2F241D', secondary: '#FFC425' },
  SF:  { primary: '#FD5A1E', secondary: '#27251F' },
  SEA: { primary: '#0C2C56', secondary: '#005C5C' },
  STL: { primary: '#C41E3A', secondary: '#0C2340' },
  TB:  { primary: '#092C5C', secondary: '#8FBCE6' },
  TEX: { primary: '#003278', secondary: '#C0111F' },
  TOR: { primary: '#134A8E', secondary: '#E8291C' },
  WSH: { primary: '#AB0003', secondary: '#14225A' },
}
