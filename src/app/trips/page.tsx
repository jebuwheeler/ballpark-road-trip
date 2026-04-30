import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import TripsDashboard from './TripsDashboard'

export default async function TripsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: trips } = await supabase
    .from('trips')
    .select('*, stops:trip_stops(*)')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">My Trips</h1>
          <p className="text-gray-500 text-sm mt-0.5">{user.email}</p>
        </div>
        <Link
          href="/trips/new"
          className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          + New Trip
        </Link>
      </div>

      <TripsDashboard initialTrips={trips ?? []} />
    </div>
  )
}
