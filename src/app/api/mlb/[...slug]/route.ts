import type { NextRequest } from 'next/server'

const MLB_API_BASE = 'https://statsapi.mlb.com/api/v1'

// Proxy all /api/mlb/* requests to the MLB Stats API.
// This avoids CORS issues when calling from the browser.

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await context.params
  const path = slug.join('/')

  // Forward the original query string
  const { search } = new URL(request.url)
  const upstreamUrl = `${MLB_API_BASE}/${path}${search}`

  const upstream = await fetch(upstreamUrl, {
    headers: { Accept: 'application/json' },
  })

  const body = await upstream.text()

  return new Response(body, {
    status: upstream.status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
    },
  })
}
