import type { MLBGame } from '@/lib/types'

interface ScoreCardProps {
  game: MLBGame
}

function statusBadge(game: MLBGame) {
  const state = game.status.abstractGameState
  const detail = game.status.detailedState

  if (state === 'Final') {
    return (
      <span data-testid="game-status" className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
        Final
      </span>
    )
  }
  if (state === 'Live') {
    return (
      <span data-testid="game-status" className="flex items-center gap-1 text-xs font-semibold text-green-400 uppercase tracking-wide">
        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
        {detail}
      </span>
    )
  }
  // Scheduled / Preview
  const gameTime = new Date(game.gameDate).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  })
  return (
    <span data-testid="game-status" className="text-xs text-gray-500">{gameTime}</span>
  )
}

function TeamRow({
  teamName,
  score,
  isWinner,
  testId,
}: {
  teamName: string
  score?: number
  isWinner?: boolean
  testId?: string
}) {
  return (
    <div className="flex items-center justify-between" data-testid={testId}>
      <span
        className={`text-sm ${isWinner ? 'font-bold text-white' : 'text-gray-300'}`}
      >
        {teamName}
      </span>
      {score !== undefined && (
        <span
          className={`text-lg font-bold tabular-nums ${
            isWinner ? 'text-white' : 'text-gray-400'
          }`}
        >
          {score}
        </span>
      )}
    </div>
  )
}

export default function ScoreCard({ game }: ScoreCardProps) {
  const { away, home } = game.teams

  return (
    <div data-testid="score-card" className="bg-gray-900 rounded-lg border border-gray-800 p-4 flex flex-col gap-3 hover:border-gray-700 transition-colors">
      <div className="flex items-center justify-between mb-1">
        {statusBadge(game)}
        <span data-testid="game-venue" className="text-xs text-gray-600">{game.venue.name}</span>
      </div>

      <div className="flex flex-col gap-1.5">
        <TeamRow
          testId="away-team"
          teamName={away.team.name}
          score={away.score}
          isWinner={away.isWinner}
        />
        <TeamRow
          testId="home-team"
          teamName={home.team.name}
          score={home.score}
          isWinner={home.isWinner}
        />
      </div>

      {game.status.abstractGameState !== 'Preview' && (
        <div className="flex gap-3 text-xs text-gray-600 border-t border-gray-800 pt-2">
          <span>{away.leagueRecord.wins}-{away.leagueRecord.losses}</span>
          <span className="text-gray-700">vs</span>
          <span>{home.leagueRecord.wins}-{home.leagueRecord.losses}</span>
        </div>
      )}
    </div>
  )
}
