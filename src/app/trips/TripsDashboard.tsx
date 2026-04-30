'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import type { Trip } from '@/lib/types'

interface Props {
  initialTrips: Trip[]
}

export default function TripsDashboard({ initialTrips }: Props) {
  const router = useRouter()
  const [trips, setTrips] = useState<Trip[]>(initialTrips)
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (tripId: string) => {
    if (!confirm('Delete this trip? This cannot be undone.')) return
    setDeleting(tripId)
    const supabase = createClient()
    await supabase.from('trips').delete().eq('id', tripId)
    setTrips((prev) => prev.filter((t) => t.id !== tripId))
    setDeleting(null)
    router.refresh()
  }

  if (trips.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p className="text-4xl mb-3">🗺️</p>
        <p className="text-lg font-medium text-gray-400">No trips yet</p>
        <p className="text-sm mt-1 mb-6">Plan your first MLB road trip</p>
        <Link
          href="/trips/new"
          className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
        >
          Create your first trip
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {trips.map((trip) => {
        const stops = trip.stops ?? []
        const visited = stops.filter((s) => s.visited).length

        return (
          <div
            key={trip.id}
            className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden hover:border-gray-700 transition-colors"
          >
            {/* Color bar */}
            <div className="h-1 bg-red-600" />

            <div className="p-4">
              <h2 className="font-semibold text-white text-base leading-tight">
                {trip.name}
              </h2>
              {trip.description && (
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {trip.description}
                </p>
              )}

              <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                <span>{stops.length} stop{stops.length !== 1 ? 's' : ''}</span>
                {stops.length > 0 && (
                  <span>{visited}/{stops.length} visited</span>
                )}
              </div>

              {/* Progress bar */}
              {stops.length > 0 && (
                <div className="mt-2 bg-gray-800 rounded-full h-1.5">
                  <div
                    className="bg-green-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${(visited / stops.length) * 100}%` }}
                  />
                </div>
              )}

              <div className="flex items-center justify-between mt-4">
                <Link
                  href={`/trips/${trip.id}`}
                  className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
                >
                  View trip →
                </Link>
                <button
                  onClick={() => handleDelete(trip.id)}
                  disabled={deleting === trip.id}
                  className="text-xs text-gray-600 hover:text-red-400 transition-colors disabled:opacity-40"
                >
                  {deleting === trip.id ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
