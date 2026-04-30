import { getCurrentStandings } from '@/lib/mlb'
import StandingsClient from './StandingsClient'

export default async function StandingsPage() {
  const records = await getCurrentStandings()

  // AL = league 103, NL = league 104
  const al = records.filter((r) => r.league.id === 103)
  const nl = records.filter((r) => r.league.id === 104)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Standings</h1>
      <StandingsClient al={al} nl={nl} />
    </div>
  )
}
