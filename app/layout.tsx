import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { AuthProvider } from '@/components/providers/auth-provider'
import { MobileNav } from '@/components/layout/mobile-nav'
import { DesktopNav } from '@/components/layout/desktop-nav'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Luma Dashboard',
  description: 'Dashboard for event vendors and mobile merchants',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
    apple: '/luma-icon-512x512.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Luma',
  },
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
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster 
              position="top-left" 
              expand={false}
              richColors
              theme="dark"
              toastOptions={{
                style: {
                  marginTop: '64px',
                },
                className: 'animate-slide-in-left',
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}