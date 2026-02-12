import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Valentine Memory Game ❤️',
  description: 'Ljubka igra spomina za Valentinovo',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sl">
      <body>{children}</body>
    </html>
  )
}
