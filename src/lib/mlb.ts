import type {
  MLBTeam,
  MLBVenue,
  MLBScheduleDate,
  MLBStandingRecord,
  MLBRosterEntry,
  MLBPlayer,
  Stadium,
} from './types'
import { TEAM_COLORS } from './types'

const MLB_API = 'https://statsapi.mlb.com/api/v1'

async function mlbFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${MLB_API}${path}`, {
    next: { revalidate: 300 }, // cache 5 minutes
  })
  if (!res.ok) {
    throw new Error(`MLB API error: ${res.status} ${path}`)
  }
  return res.json() as Promise<T>
}

// ─── Teams ────────────────────────────────────────────────────────────────────

export async function getTeams(): Promise<MLBTeam[]> {
  const data = await mlbFetch<{ teams: MLBTeam[] }>('/teams?sportId=1')
  return data.teams.filter((t) => t.active)
}

// ─── Venues ───────────────────────────────────────────────────────────────────

export async function getVenues(): Promise<MLBVenue[]> {
  const data = await mlbFetch<{ venues: MLBVenue[] }>(
    '/venues?sportId=1&hydrate=location'
  )
  return data.venues
}

// ─── Schedule ────────────────────────────────────────────────────────────────

export async function getSchedule(date: string): Promise<MLBScheduleDate[]> {
  const data = await mlbFetch<{ dates: MLBScheduleDate[] }>(
    `/schedule?sportId=1&date=${date}&hydrate=team,linescore`
  )
  return data.dates ?? []
}

export async function getTodaySchedule(): Promise<MLBScheduleDate[]> {
  const today = new Date().toISOString().split('T')[0]
  return getSchedule(today)
}

// ─── Standings ────────────────────────────────────────────────────────────────

const DIVISION_NAMES: Record<number, string> = {
  201: 'AL East',
  202: 'AL Central',
  203: 'AL West',
  204: 'NL East',
  205: 'NL Central',
  206: 'NL West',
}

export async function getStandings(season: number): Promise<MLBStandingRecord[]> {
  const data = await mlbFetch<{ records: MLBStandingRecord[] }>(
    `/standings?leagueId=103,104&season=${season}&standingsTypes=regularSeason`
  )
  const records = data.records ?? []
  // The API doesn't hydrate division names — patch them in from the known ID map
  return records.map((r) => ({
    ...r,
    division: {
      ...r.division,
      name: DIVISION_NAMES[r.division.id] ?? `Division ${r.division.id}`,
    },
  }))
}

export async function getCurrentStandings(): Promise<MLBStandingRecord[]> {
  return getStandings(new Date().getFullYear())
}

// ─── Roster ───────────────────────────────────────────────────────────────────

export async function getTeamRoster(teamId: number): Promise<MLBRosterEntry[]> {
  const data = await mlbFetch<{ roster: MLBRosterEntry[] }>(
    `/teams/${teamId}/roster?rosterType=active`
  )
  return data.roster ?? []
}

// ─── Player ───────────────────────────────────────────────────────────────────

export async function getPlayer(playerId: number): Promise<MLBPlayer | null> {
  const data = await mlbFetch<{ people: MLBPlayer[] }>(
    `/people/${playerId}?hydrate=stats(group=[hitting,pitching,fielding],type=season)`
  )
  return data.people?.[0] ?? null
}

// ─── All Stadiums (for map) ───────────────────────────────────────────────────

export async function getAllStadiums(): Promise<Stadium[]> {
  const [teams, venueData] = await Promise.all([
    getTeams(),
    mlbFetch<{ venues: MLBVenue[] }>('/venues?sportId=1&hydrate=location'),
  ])

  const venueMap = new Map<number, MLBVenue>(
    venueData.venues.map((v) => [v.id, v])
  )

  const stadiums: Stadium[] = []

  for (const team of teams) {
    const venue = venueMap.get(team.venue.id)
    const coords = venue?.location?.defaultCoordinates
    if (!coords) continue

    const colors = TEAM_COLORS[team.abbreviation] ?? {
      primary: '#6b7280',
      secondary: '#374151',
    }

    stadiums.push({
      venueId: team.venue.id,
      venueName: team.venue.name,
      teamId: team.id,
      teamName: team.name,
      teamAbbr: team.abbreviation,
      city: venue?.location?.city ?? '',
      state: venue?.location?.stateAbbrev ?? '',
      lat: coords.latitude,
      lng: coords.longitude,
      primaryColor: colors.primary,
      secondaryColor: colors.secondary,
    })
  }

  return stadiums
}

// ─── Team + Venue combined ────────────────────────────────────────────────────

export async function getTeamWithVenue(
  teamId: number
): Promise<{ team: MLBTeam; venue: MLBVenue | null }> {
  const data = await mlbFetch<{ teams: (MLBTeam & { venue: MLBVenue })[] }>(
    `/teams/${teamId}?hydrate=venue(location)`
  )
  const team = data.teams[0]
  return { team, venue: team?.venue ?? null }
}
