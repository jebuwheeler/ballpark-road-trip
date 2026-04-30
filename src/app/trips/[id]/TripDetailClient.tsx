'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase'
import type { Trip, TripStop, Stadium } from '@/lib/types'

const StadiumMap = dynamic(() => import('@/components/map/StadiumMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-900 flex items-center justify-center">
      <p className="text-gray-500 text-sm">Loading map…</p>
    </div>
  ),
})

interface Props {
  trip: Trip
  stadiums: Stadium[]
}

export default function TripDetailClient({ trip, stadiums }: Props) {
  const router = useRouter()
  const [stops, setStops] = useState<TripStop[]>(
    (trip.stops ?? []).sort((a, b) => a.stop_order - b.stop_order)
  )

  const visited = stops.filter((s) => s.visited).length

  const handleToggleVisited = async (stopId: string, visited: boolean) => {
    const supabase = createClient()
    await supabase.from('trip_stops').update({ visited }).eq('id', stopId)
    setStops((prev) => prev.map((s) => (s.id === stopId ? { ...s, visited } : s)))
  }

  // Compute center for map initial view
  const avgLng = stops.length > 0 ? stops.reduce((s, v) => s + v.lng, 0) / stops.length : -98
  const avgLat = stops.length > 0 ? stops.reduce((s, v) => s + v.lat, 0) / stops.length : 39
  const zoom = stops.length > 1 ? 4 : 5

  return (
    <div className="flex flex-col flex-1">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-start justify-between gap-4">
          <div>
            <Link
              href="/trips"
              className="text-xs text-gray-500 hover:text-white transition-colors"
            >
              ← My Trips
            </Link>
            <h1 className="text-xl font-bold text-white mt-1">{trip.name}</h1>
            {trip.description && (
              <p className="text-gray-500 text-sm mt-0.5">{trip.description}</p>
            )}
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
              <span>{stops.length} stop{stops.length !== 1 ? 's' : ''}</span>
              <span>{visited}/{stops.length} visited</span>
              {stops.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <div className="w-16 bg-gray-800 rounded-full h-1">
                    <div
                      className="bg-green-500 h-1 rounded-full"
                      style={{ width: `${(visited / stops.length) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <Link
            href={`/trips/${trip.id}/edit`}
            className="text-xs text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-3 py-1.5 rounded transition-colors"
          >
            Edit
          </Link>
        </div>
      </div>

      {/* Body — map + sidebar */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Map */}
        <div className="flex-1 relative min-h-[350px] lg:min-h-0">
          <StadiumMap
            stadiums={stadiums}
            tripStops={stops}
            initialLng={avgLng}
            initialLat={avgLat}
            initialZoom={zoom}
          />
        </div>

        {/* Stop list */}
        <div className="w-full lg:w-72 xl:w-80 bg-gray-900 border-t lg:border-t-0 lg:border-l border-gray-800 overflow-y-auto">
          {stops.length === 0 ? (
            <div className="p-6 text-center text-gray-500 text-sm">
              No stops yet.{' '}
              <Link href="/trips/new" className="text-red-400 hover:text-red-300">
                Start adding stops
              </Link>
            </div>
          ) : (
            <ol className="divide-y divide-gray-800">
              {stops.map((stop, i) => (
                <li key={stop.id} className="flex items-start gap-3 px-4 py-3">
                  <span className="text-xs text-gray-600 w-5 text-right mt-0.5 flex-shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${stop.visited ? 'line-through text-gray-500' : 'text-white'}`}>
                      {stop.venue_name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{stop.team_name}</p>
                    <p className="text-xs text-gray-600">{stop.city}, {stop.state}</p>
                  </div>
                  <label className="flex items-center gap-1 flex-shrink-0 cursor-pointer mt-0.5">
                    <input
                      type="checkbox"
                      checked={stop.visited}
                      onChange={(e) => handleToggleVisited(stop.id, e.target.checked)}
                      className="accent-green-500 w-3.5 h-3.5"
                    />
                    <span className="text-xs text-gray-600">visited</span>
                  </label>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  )
}
