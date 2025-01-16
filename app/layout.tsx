'use client'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/auth-context'
import { Toaster } from 'sonner'
import Sidebar from '@/components/sidebar'
import { Header } from '@/components/header'
import { usePathname } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const showHeader = pathname !== '/'

  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-black via-black to-accent/20`}>
        <AuthProvider>
          <div className="flex min-h-screen">
            <div className="flex-1 flex justify-center">
              <div className="w-[calc(100%-12rem)]">
                {showHeader && <Header />}
                <main>
                  <div className="px-4 py-8">
                    {children}
                  </div>
                </main>
              </div>
            </div>
            <Sidebar />
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}

