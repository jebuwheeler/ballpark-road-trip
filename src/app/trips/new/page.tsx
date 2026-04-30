'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import TripBuilder from '@/components/TripBuilder'
import type { Stadium, TripStop } from '@/lib/types'
import { TEAM_COLORS } from '@/lib/types'

function useStadiums() {
  const [stadiums, setStadiums] = useState<Stadium[]>([])

  useEffect(() => {
    Promise.all([
      fetch('/api/mlb/teams?sportId=1').then((r) => r.json()),
      fetch('/api/mlb/venues?sportId=1&hydrate=location').then((r) => r.json()),
    ]).then(([teamsData, venuesData]) => {
      const venueMap = new Map<number, { id: number; name: string; location?: { defaultCoordinates?: { latitude: number; longitude: number }; city?: string; stateAbbrev?: string } }>(
        venuesData.venues.map((v: { id: number }) => [v.id, v])
      )
      const built: Stadium[] = []
      for (const team of teamsData.teams) {
        if (!team.active) continue
        const venue = venueMap.get(team.venue.id)
        const coords = venue?.location?.defaultCoordinates
        if (!coords) continue
        const colors = TEAM_COLORS[team.abbreviation as keyof typeof TEAM_COLORS] ?? { primary: '#6b7280', secondary: '#374151' }
        built.push({
          venueId: team.venue.id, venueName: team.venue.name,
          teamId: team.id, teamName: team.name, teamAbbr: team.abbreviation,
          city: venue?.location?.city ?? '', state: venue?.location?.stateAbbrev ?? '',
          lat: coords.latitude, lng: coords.longitude,
          primaryColor: colors.primary, secondaryColor: colors.secondary,
        })
      }
      setStadiums(built)
    }).catch(console.error)
  }, [])

  return stadiums
}

export default function NewTripPage() {
  const router = useRouter()
  const stadiums = useStadiums()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [stops, setStops] = useState<TripStop[]>([])
  const [tripId, setTripId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [nameSaved, setNameSaved] = useState(false)

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { data } = await supabase
      .from('trips')
      .insert({ user_id: user.id, name: name.trim(), description: description.trim() || null })
      .select()
      .single()

    if (data) {
      setTripId(data.id)
      setNameSaved(true)
    }
    setSaving(false)
  }

  const handleAddStop = async (stadium: Stadium) => {
    if (!tripId) return
    if (stops.some((s) => s.venue_id === stadium.venueId)) return

    const supabase = createClient()
    const { data } = await supabase
      .from('trip_stops')
      .insert({
        trip_id: tripId,
        venue_id: stadium.venueId, venue_name: stadium.venueName,
        team_name: stadium.teamName, team_abbr: stadium.teamAbbr,
        city: stadium.city, state: stadium.state,
        lat: stadium.lat, lng: stadium.lng,
        stop_order: stops.length, visited: false,
        game_date: null, game_pk: null,
      })
      .select()
      .single()

    if (data) setStops((prev) => [...prev, data])
  }

  const handleRemoveStop = async (stopId: string) => {
    const supabase = createClient()
    await supabase.from('trip_stops').delete().eq('id', stopId)
    const remaining = stops.filter((s) => s.id !== stopId).map((s, i) => ({ ...s, stop_order: i }))
    await Promise.all(
      remaining.map((s) => supabase.from('trip_stops').update({ stop_order: s.stop_order }).eq('id', s.id))
    )
    setStops(remaining)
  }

  const handleReorder = async (reordered: TripStop[]) => {
    setStops(reordered)
    const supabase = createClient()
    await Promise.all(
      reordered.map((s) => supabase.from('trip_stops').update({ stop_order: s.stop_order }).eq('id', s.id))
    )
  }

  const handleToggleVisited = async (stopId: string, visited: boolean) => {
    const supabase = createClient()
    await supabase.from('trip_stops').update({ visited }).eq('id', stopId)
    setStops((prev) => prev.map((s) => (s.id === stopId ? { ...s, visited } : s)))
  }

  if (!nameSaved) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-white mb-6">New Trip</h1>
          <form onSubmit={handleSaveName} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Trip name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-red-500 transition-colors placeholder-gray-600"
                placeholder="e.g. East Coast Classic"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Description <span className="text-gray-600">(optional)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-red-500 transition-colors placeholder-gray-600 resize-none"
                placeholder="Notes about this trip…"
              />
            </div>
            <button
              type="submit"
              disabled={saving || !name.trim()}
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
            >
              {saving ? 'Creating…' : 'Create Trip & Add Stops'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Toolbar */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-sm font-semibold text-white">{name}</h1>
          <p className="text-xs text-gray-500">Add stadiums by clicking their pins on the map</p>
        </div>
        <button
          onClick={() => router.push(`/trips/${tripId}`)}
          className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          Done
        </button>
      </div>

      <div className="flex-1">
        <TripBuilder
          stadiums={stadiums}
          initialStops={stops}
          onAddStop={handleAddStop}
          onRemoveStop={handleRemoveStop}
          onReorder={handleReorder}
          onToggleVisited={handleToggleVisited}
          saving={saving}
        />
      </div>
    </div>
  )
}
