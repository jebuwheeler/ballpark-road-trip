'use client'

import { Marker } from 'react-map-gl/mapbox'
import type { Stadium } from '@/lib/types'

interface StadiumMarkerProps {
  stadium: Stadium
  inTrip: boolean
  onClick: (stadium: Stadium) => void
}

export default function StadiumMarker({ stadium, inTrip, onClick }: StadiumMarkerProps) {
  return (
    <Marker
      longitude={stadium.lng}
      latitude={stadium.lat}
      anchor="bottom"
      onClick={(e) => {
        e.originalEvent.stopPropagation()
        onClick(stadium)
      }}
    >
      <div
        data-testid="stadium-marker"
        data-team={stadium.teamAbbr}
        className="stadium-marker cursor-pointer flex items-center justify-center rounded-full text-white text-[9px] font-bold shadow-lg border-2 transition-transform hover:scale-110 select-none"
        style={{
          width: inTrip ? 34 : 28,
          height: inTrip ? 34 : 28,
          backgroundColor: stadium.primaryColor,
          borderColor: inTrip ? '#f59e0b' : stadium.secondaryColor,
          boxShadow: inTrip
            ? `0 0 0 3px #f59e0b, 0 2px 8px rgba(0,0,0,0.5)`
            : `0 2px 6px rgba(0,0,0,0.4)`,
        }}
        title={`${stadium.teamName} — ${stadium.venueName}`}
      >
        {stadium.teamAbbr.slice(0, 2)}
      </div>
    </Marker>
  )
}
