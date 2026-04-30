'use client'

import dynamic from 'next/dynamic'
import type { Stadium } from '@/lib/types'

// Mapbox only works in the browser; dynamic import avoids SSR issues
const StadiumMap = dynamic(() => import('@/components/map/StadiumMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-900 flex items-center justify-center">
      <p className="text-gray-500 text-sm">Loading map…</p>
    </div>
  ),
})

export default function HomeMap({ stadiums }: { stadiums: Stadium[] }) {
  return (
    <div className="absolute inset-0">
      <StadiumMap stadiums={stadiums} />
    </div>
  )
}
