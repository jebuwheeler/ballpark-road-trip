'use client'

import { useScores } from '@/hooks/useScores'
import ScoreCard from '@/components/ScoreCard'

export default function ScoresPage() {
  const { games, liveGames, loading, error, lastUpdated, refetch } = useScores()

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Scores</h1>
          <p className="text-gray-500 text-sm mt-0.5">{today}</p>
        </div>
        <div className="flex items-center gap-3">
          {liveGames.length > 0 && (
            <span className="flex items-center gap-1.5 text-xs text-green-400 font-medium">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              {liveGames.length} live
            </span>
          )}
          {lastUpdated && (
            <span className="text-xs text-gray-600">
              Updated {lastUpdated.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
            </span>
          )}
          <button
            onClick={refetch}
            className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded border border-gray-700 hover:border-gray-500"
          >
            Refresh
          </button>
        </div>
      </div>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-gray-900 rounded-lg border border-gray-800 h-32 animate-pulse"
            />
          ))}
        </div>
      )}

      {error && (
        <div className="bg-red-950 border border-red-800 rounded-lg p-4 text-red-300 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && games.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          <p className="text-4xl mb-3">⚾</p>
          <p className="text-lg font-medium text-gray-400">No games scheduled today</p>
          <p className="text-sm mt-1">Check back during the regular season (April – October)</p>
        </div>
      )}

      {!loading && games.length > 0 && (
        <>
          {/* Live games first */}
          {liveGames.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xs font-semibold text-green-400 uppercase tracking-widest mb-3">
                Live
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {liveGames.map((g) => (
                  <ScoreCard key={g.gamePk} game={g} />
                ))}
              </div>
            </section>
          )}

          {/* Final games */}
          {games.filter((g) => g.status.abstractGameState === 'Final').length > 0 && (
            <section className="mb-8">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
                Final
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {games
                  .filter((g) => g.status.abstractGameState === 'Final')
                  .map((g) => (
                    <ScoreCard key={g.gamePk} game={g} />
                  ))}
              </div>
            </section>
          )}

          {/* Upcoming games */}
          {games.filter((g) => g.status.abstractGameState === 'Preview').length > 0 && (
            <section>
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
                Upcoming
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {games
                  .filter((g) => g.status.abstractGameState === 'Preview')
                  .map((g) => (
                    <ScoreCard key={g.gamePk} game={g} />
                  ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}
