'use client'

import { Source, Layer } from 'react-map-gl/mapbox'
import type { TripStop } from '@/lib/types'

interface RouteLayerProps {
  stops: TripStop[]
}

export default function RouteLayer({ stops }: RouteLayerProps) {
  const sorted = [...stops].sort((a, b) => a.stop_order - b.stop_order)

  const geojson: GeoJSON.Feature<GeoJSON.LineString> = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: sorted.map((s) => [s.lng, s.lat]),
    },
  }

  return (
    <Source id="route" type="geojson" data={geojson}>
      {/* Glow layer */}
      <Layer
        id="route-glow"
        type="line"
        paint={{
          'line-color': '#f59e0b',
          'line-width': 6,
          'line-opacity': 0.3,
          'line-blur': 4,
        }}
        layout={{ 'line-join': 'round', 'line-cap': 'round' }}
      />
      {/* Main line */}
      <Layer
        id="route-line"
        type="line"
        paint={{
          'line-color': '#f59e0b',
          'line-width': 2.5,
          'line-opacity': 0.9,
          'line-dasharray': [4, 3],
        }}
        layout={{ 'line-join': 'round', 'line-cap': 'round' }}
      />
    </Source>
  )
}
