# Ballpark Road Trip

An interactive MLB stadium road trip planner with live scores, standings, and a full trip-building tool — rebuilt from a 2020 coding bootcamp project into a modern full-stack application.

---

## The Story

In 2020 I built a basic version of this app during a coding bootcamp. It had static JSON data for stadium info, no live stats, and the core feature — actually planning a road trip between stadiums — was never finished.

Five years later I rebuilt it from scratch with a completely different stack, real MLB data, and the trip planner I never got around to the first time.

**Then:** Static JSON, no auth, no map, no live data, unfinished feature
**Now:** Live MLB API, interactive Mapbox map, Supabase auth, full trip planner with route visualization

---

## Features

- **Interactive stadium map** — All 30 MLB ballparks plotted on a full-screen Mapbox map with custom team-colored pins. Click any pin to see stadium info.
- **Live scores** — Today's MLB schedule with real-time game status, polling every 30 seconds during live games
- **Standings** — Current AL and NL division standings pulled directly from the MLB Stats API
- **Team pages** — All 30 teams with active rosters and venue details
- **Trip planner** — Build a custom road trip by adding stadium stops, drag to reorder them, and watch the route draw on the map in real time
- **Trip tracking** — Save multiple trips to your account, mark stops as visited, and track your progress
- **Auth** — Email/password sign up and login via Supabase, with protected routes

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Map | Mapbox GL JS + react-map-gl |
| Data | MLB Stats API (free, no auth required) |
| Database + Auth | Supabase (PostgreSQL + Row Level Security) |
| Hosting | Vercel |

---

## Architecture Highlights

**Server / Client split** — Data-heavy pages (standings, teams, team rosters) are React Server Components that fetch directly from the MLB Stats API at request time. Interactive pages (scores, trip builder) are Client Components.

**MLB API proxy** — A catch-all Next.js Route Handler at `/api/mlb/[...slug]` forwards requests to the MLB Stats API. This avoids CORS issues when the browser needs to call the API directly (e.g. the live scores polling hook).

**Supabase Row Level Security** — The database enforces that users can only read and write their own trips. There is no server-side authorization logic — the database handles it.

**Auth middleware** — A Next.js proxy layer intercepts all `/trips` routes and redirects unauthenticated users to login, with the original destination saved as a query param.

---

## Database Schema

```sql
trips (id, user_id, name, description, created_at, updated_at)
trip_stops (id, trip_id, venue_id, venue_name, team_name, team_abbr,
            city, state, lat, lng, stop_order, visited, game_date, game_pk)
```

Trips belong to a user. Stops belong to a trip. Deleting a trip cascades to its stops. Row Level Security policies on both tables enforce ownership at the database level.

---

## Running Locally

**Prerequisites:** Node.js 20+, a free [Mapbox account](https://account.mapbox.com), a free [Supabase project](https://supabase.com)

```bash
git clone https://github.com/jebuwheeler/ballpark-road-trip.git
cd ballpark-road-trip
npm install
```

Create `.env.local`:

```bash
NEXT_PUBLIC_MAPBOX_TOKEN=pk.your_token_here
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Run the Supabase schema:

```sql
CREATE TABLE trips (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE trip_stops (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id     UUID REFERENCES trips(id) ON DELETE CASCADE,
  venue_id    INTEGER NOT NULL,
  venue_name  TEXT NOT NULL,
  team_name   TEXT NOT NULL,
  team_abbr   TEXT NOT NULL,
  city        TEXT NOT NULL,
  state       TEXT NOT NULL,
  lat         DOUBLE PRECISION NOT NULL,
  lng         DOUBLE PRECISION NOT NULL,
  stop_order  INTEGER NOT NULL,
  visited     BOOLEAN DEFAULT FALSE,
  game_date   DATE,
  game_pk     INTEGER
);

ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_stops ENABLE ROW LEVEL SECURITY;

CREATE POLICY trips_owner ON trips FOR ALL USING (auth.uid() = user_id);
CREATE POLICY stops_owner ON trip_stops FOR ALL USING (
  trip_id IN (SELECT id FROM trips WHERE user_id = auth.uid())
);
```

Then start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## What Changed Between Then and Now

Going back to a bootcamp project with more experience made a few things obvious:

- **The original data model was wrong** — static JSON meant every stadium detail was hardcoded and stale. The rebuild uses the official MLB Stats API, so venue names, rosters, and scores are always current.
- **The map was an afterthought in the original** — In the rebuild it's the foundation. The whole home page is the map.
- **Auth adds real complexity** — Wiring Supabase SSR auth correctly with Next.js 16's async APIs (cookies, params) took careful attention. The split between browser and server Supabase clients is something the bootcamp version never had to think about.
- **Finishing the feature matters** — The trip planner was the whole point of the original app. Building it properly — with drag-to-reorder, map route drawing, visited tracking, and persistent storage — took more thought than the rest of the app combined.
