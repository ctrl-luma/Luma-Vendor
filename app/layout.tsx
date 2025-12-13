import type { Metadata, Viewport } from 'next'
import './globals.css'
import { AuthProvider } from '@/components/providers/auth-provider'
import { Toaster } from 'sonner'

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
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
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
                background: '#111827',
                border: '1px solid #374151',
                color: '#F3F4F6',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}