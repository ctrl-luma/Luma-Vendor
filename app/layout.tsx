import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { MobileNav } from '@/components/layout/mobile-nav'
import { DesktopNav } from '@/components/layout/desktop-nav'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Luma Dashboard',
  description: 'Dashboard for event vendors and mobile merchants',
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="hidden md:block">
            <DesktopNav />
          </div>
          <div className="min-h-screen pb-16 md:pb-0">
            {children}
          </div>
          <div className="md:hidden">
            <MobileNav />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}