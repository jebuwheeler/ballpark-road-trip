'use client'

import { useState } from 'react'
import type { MLBStandingRecord } from '@/lib/types'
import StandingsTable from '@/components/StandingsTable'

interface Props {
  al: MLBStandingRecord[]
  nl: MLBStandingRecord[]
}

export default function StandingsClient({ al, nl }: Props) {
  const [tab, setTab] = useState<'al' | 'nl'>('al')
  const divisions = tab === 'al' ? al : nl

  return (
    <>
      {/* League tabs */}
      <div className="flex gap-1 mb-6 bg-gray-900 p-1 rounded-lg w-fit">
        {(['al', 'nl'] as const).map((league) => (
          <button
            key={league}
            data-testid={`standings-tab-${league}`}
            onClick={() => setTab(league)}
            className={`px-6 py-1.5 rounded text-sm font-semibold transition-colors ${
              tab === league
                ? 'bg-red-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {league.toUpperCase()}
          </button>
        ))}
      </div>

      {divisions.length === 0 ? (
        <p className="text-gray-500 text-sm">
          Standings unavailable — check back during the regular season.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {divisions.map((division) => (
            <StandingsTable key={division.division.id} division={division} />
          ))}
        </div>
      )}
    </>
  )
}
