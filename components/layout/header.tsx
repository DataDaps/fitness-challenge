'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { UserCircle } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import AuthModal from '@/components/auth/auth-modal'

export default function Header() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { user, logout } = useAuth()

  return (
    <header className="fixed top-0 left-0 right-0 z-10 glass-effect border-b border-white/10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-white">Fitness Challenge</h1>
        <div>
          {user ? (
            <Button
              variant="ghost"
              className="text-white hover:text-accent"
              onClick={logout}
            >
              Sign Out
            </Button>
          ) : (
            <Button
              variant="ghost"
              className="text-white hover:text-accent"
              onClick={() => setShowAuthModal(true)}
            >
              <UserCircle className="w-6 h-6" />
            </Button>
          )}
        </div>
      </div>
      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </header>
  )
}

