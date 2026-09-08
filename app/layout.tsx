import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/components/language-provider'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'NeXa Link — One Platform. Every Garment Care Need.',
  description:
    'NeXa Link is a hyperlocal garment-care marketplace. Book laundry, ironing, dry cleaning, shoe care and saree pleating — one pickup, multiple services, one delivery.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  themeColor: '#5b21b6',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jakarta.variable} bg-background`}
    >
      <body className="antialiased font-sans">
        <LanguageProvider>
          {children}
        </LanguageProvider>

        {process.env.NODE_ENV === 'production' && (
          <Analytics />
        )}
      </body>
    </html>
  )
}