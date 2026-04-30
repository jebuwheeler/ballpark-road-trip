import Link from 'next/link'
import type { MLBTeam } from '@/lib/types'
import { TEAM_COLORS } from '@/lib/types'

interface TeamCardProps {
  team: MLBTeam
}

export default function TeamCard({ team }: TeamCardProps) {
  const colors = TEAM_COLORS[team.abbreviation] ?? {
    primary: '#6b7280',
    secondary: '#374151',
  }

  return (
    <Link
      href={`/teams/${team.id}`}
      className="block rounded-lg overflow-hidden border border-gray-800 hover:border-gray-600 transition-all hover:scale-[1.02] hover:shadow-lg"
    >
      {/* Color banner */}
      <div
        className="h-2"
        style={{ backgroundColor: colors.primary }}
      />

      <div className="bg-gray-900 p-4">
        {/* Abbreviation badge */}
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm mb-3 mx-auto border-2"
          style={{
            backgroundColor: colors.primary,
            borderColor: colors.secondary,
          }}
        >
          {team.abbreviation}
        </div>

        <h3 className="text-sm font-semibold text-white text-center leading-tight">
          {team.name}
        </h3>
        <p className="text-xs text-gray-500 text-center mt-0.5">
          {team.venue.name}
        </p>
        <p className="text-xs text-gray-600 text-center mt-0.5">
          {team.division.name}
        </p>
      </div>
    </Link>
  )
}
