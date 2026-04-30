'use client'

import { useState, useEffect, useCallback } from 'react'
import type { MLBGame } from '@/lib/types'

export function useScores(date?: string) {
  const [games, setGames] = useState<MLBGame[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchScores = useCallback(async () => {
    try {
      const targetDate = date ?? new Date().toISOString().split('T')[0]
      const res = await fetch(`/api/mlb/schedule?sportId=1&date=${targetDate}&hydrate=team,linescore`)
      if (!res.ok) throw new Error('Failed to fetch scores')
      const data = await res.json()
      const allGames: MLBGame[] = data.dates?.flatMap((d: { games: MLBGame[] }) => d.games) ?? []
      setGames(allGames)
      setLastUpdated(new Date())
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [date])

  useEffect(() => {
    fetchScores()

    // Poll every 30s only when there are live games
    const interval = setInterval(() => {
      fetchScores()
    }, 30_000)

    return () => clearInterval(interval)
  }, [fetchScores])

  const liveGames = games.filter((g) => g.status.abstractGameState === 'Live')
  const finalGames = games.filter((g) => g.status.abstractGameState === 'Final')
  const scheduledGames = games.filter((g) => g.status.abstractGameState === 'Preview')

  return { games, liveGames, finalGames, scheduledGames, loading, error, lastUpdated, refetch: fetchScores }
}
