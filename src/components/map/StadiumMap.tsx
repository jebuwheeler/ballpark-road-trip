'use client'

import { useRef, useCallback, useState } from 'react'
import Map, { type MapRef, NavigationControl, Popup } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import StadiumMarker from './StadiumMarker'
import RouteLayer from './RouteLayer'
import type { Stadium, TripStop } from '@/lib/types'

interface PopupInfo {
  stadium: Stadium
  x: number
  y: number
}

interface StadiumMapProps {
  stadiums: Stadium[]
  /** Stops for the current trip (draws route line) */
  tripStops?: TripStop[]
  /** Called when user clicks "Add to Trip" in popup */
  onAddStop?: (stadium: Stadium) => void
  /** Initial viewport */
  initialLng?: number
  initialLat?: number
  initialZoom?: number
}

export default function StadiumMap({
  stadiums,
  tripStops,
  onAddStop,
  initialLng = -98,
  initialLat = 39,
  initialZoom = 3.5,
}: StadiumMapProps) {
  const mapRef = useRef<MapRef>(null)
  const [popup, setPopup] = useState<PopupInfo | null>(null)

  const handleMarkerClick = useCallback((stadium: Stadium) => {
    setPopup((prev) =>
      prev?.stadium.venueId === stadium.venueId ? null : { stadium, x: stadium.lng, y: stadium.lat }
    )
  }, [])

  const isInTrip = useCallback(
    (venueId: number) => tripStops?.some((s) => s.venue_id === venueId) ?? false,
    [tripStops]
  )

  return (
    <Map
      ref={mapRef}
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      initialViewState={{
        longitude: initialLng,
        latitude: initialLat,
        zoom: initialZoom,
      }}
      style={{ width: '100%', height: '100%' }}
      mapStyle="mapbox://styles/mapbox/dark-v11"
      onClick={(e) => {
        // Close popup if clicking empty space
        if (!(e.originalEvent.target as HTMLElement).closest('.stadium-marker')) {
          setPopup(null)
        }
      }}
    >
      <NavigationControl position="top-right" />

      {/* Trip route */}
      {tripStops && tripStops.length > 1 && (
        <RouteLayer stops={tripStops} />
      )}

      {/* Stadium pins */}
      {stadiums.map((stadium) => (
        <StadiumMarker
          key={stadium.venueId}
          stadium={stadium}
          inTrip={isInTrip(stadium.venueId)}
          onClick={handleMarkerClick}
        />
      ))}

      {/* Info popup */}
      {popup && (
        <Popup
          longitude={popup.x}
          latitude={popup.y}
          anchor="bottom"
          offset={20}
          closeButton
          closeOnClick={false}
          onClose={() => setPopup(null)}
          className="stadium-popup"
        >
          <div className="p-1 min-w-[180px]">
            <p className="font-bold text-sm text-gray-900 leading-tight">
              {popup.stadium.venueName}
            </p>
            <p className="text-xs text-gray-600 mt-0.5">
              {popup.stadium.teamName}
            </p>
            <p className="text-xs text-gray-500">
              {popup.stadium.city}, {popup.stadium.state}
            </p>
            {onAddStop && (
              <button
                onClick={() => {
                  onAddStop(popup.stadium)
                  setPopup(null)
                }}
                disabled={isInTrip(popup.stadium.venueId)}
                className="mt-2 w-full text-xs font-medium py-1 px-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: isInTrip(popup.stadium.venueId)
                    ? '#9ca3af'
                    : popup.stadium.primaryColor,
                  color: '#fff',
                }}
              >
                {isInTrip(popup.stadium.venueId) ? 'Added' : '+ Add to Trip'}
              </button>
            )}
          </div>
        </Popup>
      )}
    </Map>
  )
}
