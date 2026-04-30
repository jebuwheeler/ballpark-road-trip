'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const links = [
  { href: '/', label: 'Map', testId: 'nav-link-map' },
  { href: '/scores', label: 'Scores', testId: 'nav-link-scores' },
  { href: '/standings', label: 'Standings', testId: 'nav-link-standings' },
  { href: '/teams', label: 'Teams', testId: 'nav-link-teams' },
  { href: '/trips', label: 'My Trips', testId: 'nav-link-trips' },
]

export default function Nav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <nav data-testid="nav" className="bg-gray-900 border-b border-gray-800 z-50 relative">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          href="/"
          data-testid="nav-logo"
          className="text-white font-bold text-lg tracking-tight flex items-center gap-2"
        >
          <span className="text-red-500">⚾</span>
          <span>Ballpark Road Trip</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map(({ href, label, testId }) => (
            <Link
              key={href}
              href={href}
              data-testid={testId}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                pathname === href
                  ? 'bg-red-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        <button
          className="md:hidden p-2 rounded text-gray-400 hover:text-white hover:bg-gray-800"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          data-testid="nav-mobile-toggle"
        >
          {open ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <div data-testid="nav-mobile-menu" className="md:hidden border-t border-gray-800 px-4 py-2 flex flex-col gap-1">
          {links.map(({ href, label, testId }) => (
            <Link
              key={href}
              href={href}
              data-testid={`mobile-${testId}`}
              onClick={() => setOpen(false)}
              className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                pathname === href
                  ? 'bg-red-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
