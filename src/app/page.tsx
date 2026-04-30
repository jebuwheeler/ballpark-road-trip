import { getAllStadiums } from '@/lib/mlb'
import HomeMap from '@/components/HomeMap'

export default async function HomePage() {
  const stadiums = await getAllStadiums()

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero text overlay */}
      <div className="absolute top-20 left-0 right-0 z-10 pointer-events-none px-4">
        <div className="max-w-lg mx-auto text-center">
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">
            All 30 Ballparks
          </h1>
          <p className="text-gray-300 mt-1 text-sm drop-shadow">
            Click any stadium to learn more or add it to a trip
          </p>
        </div>
      </div>

      {/* Full-screen map */}
      <div className="flex-1 relative">
        <HomeMap stadiums={stadiums} />
      </div>
    </div>
  )
}
