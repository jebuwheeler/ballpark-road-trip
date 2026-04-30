import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/Nav'

export const metadata: Metadata = {
  title: 'Ballpark Road Trip',
  description:
    'Plan your MLB stadium road trip — live scores, standings, and an interactive map of all 30 ballparks.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-gray-950 text-gray-100 antialiased flex flex-col">
        <Nav />
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  )
}
