'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import type { Trip, TripStop, Stadium } from '@/lib/types'

export function useTrips() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTrips = useCallback(async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('trips')
      .select('*, stops:trip_stops(*)')
      .order('created_at', { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setTrips(data ?? [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchTrips()
  }, [fetchTrips])

  const createTrip = async (name: string, description?: string): Promise<Trip | null> => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('trips')
      .insert({ user_id: user.id, name, description: description ?? null })
      .select()
      .single()

    if (error) {
      setError(error.message)
      return null
    }
    await fetchTrips()
    return data
  }

  const deleteTrip = async (tripId: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('trips').delete().eq('id', tripId)
    if (!error) await fetchTrips()
  }

  const addStop = async (tripId: string, stadium: Stadium, currentStops: TripStop[]) => {
    const supabase = createClient()
    const stopOrder = currentStops.length

    const { error } = await supabase.from('trip_stops').insert({
      trip_id: tripId,
      venue_id: stadium.venueId,
      venue_name: stadium.venueName,
      team_name: stadium.teamName,
      team_abbr: stadium.teamAbbr,
      city: stadium.city,
      state: stadium.state,
      lat: stadium.lat,
      lng: stadium.lng,
      stop_order: stopOrder,
      visited: false,
      game_date: null,
      game_pk: null,
    })

    if (!error) await fetchTrips()
    return error
  }

  const removeStop = async (stopId: string, tripId: string, currentStops: TripStop[]) => {
    const supabase = createClient()
    await supabase.from('trip_stops').delete().eq('id', stopId)

    // Re-order remaining stops
    const remaining = currentStops
      .filter((s) => s.id !== stopId)
      .map((s, i) => ({ id: s.id, stop_order: i }))

    if (remaining.length > 0) {
      await Promise.all(
        remaining.map((s) =>
          supabase.from('trip_stops').update({ stop_order: s.stop_order }).eq('id', s.id)
        )
      )
    }

    await fetchTrips()
  }

  const reorderStops = async (tripId: string, stops: TripStop[]) => {
    const supabase = createClient()
    await Promise.all(
      stops.map((stop, i) =>
        supabase.from('trip_stops').update({ stop_order: i }).eq('id', stop.id)
      )
    )
    await fetchTrips()
  }

  const toggleVisited = async (stopId: string, visited: boolean) => {
    const supabase = createClient()
    await supabase.from('trip_stops').update({ visited }).eq('id', stopId)
    await fetchTrips()
  }

  return {
    trips,
    loading,
    error,
    refetch: fetchTrips,
    createTrip,
    deleteTrip,
    addStop,
    removeStop,
    reorderStops,
    toggleVisited,
  }
}
