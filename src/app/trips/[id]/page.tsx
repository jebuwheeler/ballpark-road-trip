import { createServerSupabaseClient } from '@/lib/supabase-server'
import { getAllStadiums } from '@/lib/mlb'
import { notFound, redirect } from 'next/navigation'
import TripDetailClient from './TripDetailClient'

export default async function TripDetailPage(props: PageProps<'/trips/[id]'>) {
  const { id } = await props.params

  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: trip } = await supabase
    .from('trips')
    .select('*, stops:trip_stops(*)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!trip) notFound()

  const stadiums = await getAllStadiums()

  return <TripDetailClient trip={trip} stadiums={stadiums} />
}
