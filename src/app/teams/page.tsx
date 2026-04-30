import { getTeams } from '@/lib/mlb'
import TeamCard from '@/components/TeamCard'

export default async function TeamsPage() {
  const teams = await getTeams()
  const sorted = [...teams].sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-2">All 30 Teams</h1>
      <p className="text-gray-500 text-sm mb-8">
        Click a team to see their roster and stadium info.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {sorted.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>
    </div>
  )
}
