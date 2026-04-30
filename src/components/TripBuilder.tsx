'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import type { Stadium, TripStop } from '@/lib/types'

const StadiumMap = dynamic(() => import('@/components/map/StadiumMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-900 flex items-center justify-center">
      <p className="text-gray-500 text-sm">Loading map…</p>
    </div>
  ),
})

interface TripBuilderProps {
  stadiums: Stadium[]
  initialStops?: TripStop[]
  onAddStop: (stadium: Stadium) => void
  onRemoveStop: (stopId: string) => void
  onReorder: (stops: TripStop[]) => void
  onToggleVisited: (stopId: string, visited: boolean) => void
  saving?: boolean
}

export default function TripBuilder({
  stadiums,
  initialStops = [],
  onAddStop,
  onRemoveStop,
  onReorder,
  onToggleVisited,
  saving,
}: TripBuilderProps) {
  const [stops, setStops] = useState<TripStop[]>(initialStops)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)

  // Sync when parent updates initialStops
  const syncedStops = initialStops.length > 0 ? initialStops : stops

  const handleAddStop = useCallback(
    (stadium: Stadium) => {
      onAddStop(stadium)
    },
    [onAddStop]
  )

  const handleDragStart = (id: string) => setDraggingId(id)
  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault()
    setDragOverId(id)
  }
  const handleDrop = (targetId: string) => {
    if (!draggingId || draggingId === targetId) {
      setDraggingId(null)
      setDragOverId(null)
      return
    }

    const fromIndex = syncedStops.findIndex((s) => s.id === draggingId)
    const toIndex = syncedStops.findIndex((s) => s.id === targetId)
    if (fromIndex === -1 || toIndex === -1) return

    const newStops = [...syncedStops]
    const [moved] = newStops.splice(fromIndex, 1)
    newStops.splice(toIndex, 0, moved)
    const reordered = newStops.map((s, i) => ({ ...s, stop_order: i }))

    setStops(reordered)
    setDraggingId(null)
    setDragOverId(null)
    onReorder(reordered)
  }

  const sortedStops = [...syncedStops].sort((a, b) => a.stop_order - b.stop_order)

  return (
    <div className="flex flex-col lg:flex-row h-full gap-0">
      {/* Sidebar — stop list */}
      <div className="w-full lg:w-72 xl:w-80 bg-gray-900 border-r border-gray-800 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <h3 className="font-semibold text-white text-sm">
            Stops{' '}
            <span className="text-gray-500 font-normal">({sortedStops.length})</span>
          </h3>
          {saving && (
            <span className="text-xs text-gray-500 animate-pulse">Saving…</span>
          )}
        </div>

        {sortedStops.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <p className="text-gray-600 text-sm">Click a stadium pin on the map to add your first stop.</p>
          </div>
        ) : (
          <ol className="flex-1 overflow-y-auto divide-y divide-gray-800">
            {sortedStops.map((stop, i) => (
              <li
                key={stop.id}
                draggable
                onDragStart={() => handleDragStart(stop.id)}
                onDragOver={(e) => handleDragOver(e, stop.id)}
                onDrop={() => handleDrop(stop.id)}
                onDragEnd={() => { setDraggingId(null); setDragOverId(null) }}
                className={`flex items-center gap-3 px-4 py-3 cursor-grab transition-colors ${
                  draggingId === stop.id ? 'opacity-40' : ''
                } ${
                  dragOverId === stop.id ? 'bg-gray-800' : 'hover:bg-gray-800/50'
                }`}
              >
                {/* Order number */}
                <span className="text-xs text-gray-600 w-5 text-right flex-shrink-0">
                  {i + 1}
                </span>

                {/* Stop info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {stop.venue_name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {stop.team_name}
                  </p>
                  <p className="text-xs text-gray-600">
                    {stop.city}, {stop.state}
                  </p>
                </div>

                {/* Visited checkbox */}
                <label className="flex items-center gap-1 flex-shrink-0 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={stop.visited}
                    onChange={(e) => onToggleVisited(stop.id, e.target.checked)}
                    className="accent-green-500 w-3.5 h-3.5"
                  />
                  <span className="text-xs text-gray-600">visited</span>
                </label>

                {/* Remove */}
                <button
                  onClick={() => onRemoveStop(stop.id)}
                  className="text-gray-600 hover:text-red-400 transition-colors flex-shrink-0"
                  aria-label="Remove stop"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </li>
            ))}
          </ol>
        )}

        {/* Drag hint */}
        {sortedStops.length > 1 && (
          <p className="text-xs text-gray-700 px-4 py-2 border-t border-gray-800">
            Drag to reorder stops
          </p>
        )}
      </div>

      {/* Map */}
      <div className="flex-1 relative min-h-[400px] lg:min-h-0">
        <StadiumMap
          stadiums={stadiums}
          tripStops={sortedStops}
          onAddStop={handleAddStop}
        />
      </div>
    </div>
  )
}
