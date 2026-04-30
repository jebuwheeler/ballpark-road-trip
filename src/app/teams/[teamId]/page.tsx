import { getTeamWithVenue, getTeamRoster } from '@/lib/mlb'
import { TEAM_COLORS } from '@/lib/types'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function TeamDetailPage(
  props: PageProps<'/teams/[teamId]'>
) {
  const { teamId } = await props.params
  const id = parseInt(teamId, 10)
  if (isNaN(id)) notFound()

  const [{ team, venue }, roster] = await Promise.all([
    getTeamWithVenue(id),
    getTeamRoster(id),
  ])

  if (!team) notFound()

  const colors = TEAM_COLORS[team.abbreviation] ?? {
    primary: '#6b7280',
    secondary: '#374151',
  }

  const coords = venue?.location?.defaultCoordinates

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Back */}
      <Link
        href="/teams"
        className="text-sm text-gray-500 hover:text-white transition-colors mb-6 inline-flex items-center gap-1"
      >
        ← All Teams
      </Link>

      {/* Team header */}
      <div className="flex items-start gap-6 mb-8">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-white text-lg font-bold border-2 flex-shrink-0"
          style={{ backgroundColor: colors.primary, borderColor: colors.secondary }}
        >
          {team.abbreviation}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">{team.name}</h1>
          <p className="text-gray-400 mt-1">
            {team.division.name} · {team.league.name}
          </p>
          {venue && (
            <p className="text-gray-500 text-sm mt-1">
              {venue.name}
              {venue.location?.city && ` · ${venue.location.city}, ${venue.location.stateAbbrev}`}
            </p>
          )}
          {coords && (
            <p className="text-gray-600 text-xs mt-0.5">
              {coords.latitude.toFixed(4)}°N, {Math.abs(coords.longitude).toFixed(4)}°W
            </p>
          )}
        </div>
      </div>

      {/* Color accent bar */}
      <div
        className="h-1 rounded mb-8"
        style={{ background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})` }}
      />

      {/* Roster */}
      <h2 className="text-lg font-semibold text-white mb-4">Active Roster</h2>
      {roster.length === 0 ? (
        <p className="text-gray-500 text-sm">Roster unavailable.</p>
      ) : (
        <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-500 uppercase tracking-wide bg-gray-800/50 border-b border-gray-800">
                <th className="text-left px-4 py-3 font-medium w-12">#</th>
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium">Position</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {roster
                .sort((a, b) => {
                  const aNum = parseInt(a.jerseyNumber, 10) || 99
                  const bNum = parseInt(b.jerseyNumber, 10) || 99
                  return aNum - bNum
                })
                .map((entry) => (
                  <tr
                    key={entry.person.id}
                    className="border-b border-gray-800/50 last:border-0 hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-4 py-2.5 text-gray-500 font-mono text-xs">
                      {entry.jerseyNumber || '—'}
                    </td>
                    <td className="px-4 py-2.5 font-medium text-white">
                      {entry.person.fullName}
                    </td>
                    <td className="px-4 py-2.5 text-gray-400">
                      {entry.position.abbreviation} · {entry.position.name}
                    </td>
                    <td className="px-4 py-2.5 text-gray-600 text-xs hidden md:table-cell">
                      {entry.status.description}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
