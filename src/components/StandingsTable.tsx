import type { MLBStandingRecord } from '@/lib/types'

interface StandingsTableProps {
  division: MLBStandingRecord
}

export default function StandingsTable({ division }: StandingsTableProps) {
  return (
    <div data-testid="standings-table" className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-800 bg-gray-800/50">
        <h3 data-testid="standings-division-name" className="text-sm font-semibold text-white">
          {division.division.name}
        </h3>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-gray-500 uppercase tracking-wide border-b border-gray-800">
            <th className="text-left px-4 py-2 font-medium">Team</th>
            <th className="text-right px-2 py-2 font-medium w-10">W</th>
            <th className="text-right px-2 py-2 font-medium w-10">L</th>
            <th className="text-right px-3 py-2 font-medium w-14">PCT</th>
            <th className="text-right px-4 py-2 font-medium w-12">GB</th>
          </tr>
        </thead>
        <tbody>
          {division.teamRecords.map((record, i) => (
            <tr
              key={record.team.id}
              data-testid="standings-row"
              className={`border-b border-gray-800/50 last:border-0 ${
                i === 0 ? 'text-white' : 'text-gray-300'
              }`}
            >
              <td className="px-4 py-2.5 font-medium">{record.team.name}</td>
              <td className="text-right px-2 py-2.5 tabular-nums">{record.wins}</td>
              <td className="text-right px-2 py-2.5 tabular-nums">{record.losses}</td>
              <td className="text-right px-3 py-2.5 tabular-nums text-gray-400">
                {record.pct}
              </td>
              <td className="text-right px-4 py-2.5 tabular-nums text-gray-500">
                {record.gamesBack === '-' ? '—' : record.gamesBack}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
