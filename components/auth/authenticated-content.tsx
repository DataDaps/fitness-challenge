'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import AuthForm from './auth-form'
import FitnessChallenge from '../fitness-challenge'
import Dashboard from '../dashboard'
import { Button } from '@/components/ui/button'
import { UserCircle, PlusCircle } from 'lucide-react'
import AuthModal from './auth-modal'
import ProfileCard from '../profile-card'
import { saveUserProfile, type UserProfile } from '@/lib/user-service'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function AuthenticatedContent() {
  const { user } = useAuth()
  const router = useRouter()
  const [showDashboard, setShowDashboard] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [tempProfiles, setTempProfiles] = useState<UserProfile[]>([])

  // Transfer temporary profiles to Firebase when user signs in
  useEffect(() => {
    const transferTempProfiles = async () => {
      if (user && tempProfiles.length > 0) {
        try {
          await Promise.all(
            tempProfiles.map(profile => saveUserProfile(user.uid, profile))
          )
          toast.success('Your progress cards have been saved to your account!')
          setTempProfiles([]) // Clear temp profiles after transfer
          router.refresh() // Refresh to show the newly saved profiles
        } catch (error) {
          toast.error('Failed to save some progress cards. Please try again later.')
        }
      }
    }

    transferTempProfiles()
  }, [user, tempProfiles, router])

  const handleProfileCreated = async (profileIdOrProfile: string | UserProfile) => {
    if (typeof profileIdOrProfile === 'string') {
      // If we got a profileId, we're already authenticated and the profile is saved
      setShowDashboard(true)
    } else {
      // If we got a profile object, we're not authenticated and need to save it temporarily
      if (!user) {
        setTempProfiles(prev => [...prev, profileIdOrProfile])
      }
      setShowDashboard(true)
    }
  }

  const handleCreateNew = () => {
    if (user) {
      router.push('/new')
    } else {
      setShowDashboard(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-center space-x-4">
        <Button
          onClick={() => setShowDashboard(true)}
          variant={showDashboard ? "default" : "outline"}
          className={showDashboard ? "bg-accent hover:bg-accent/90" : "glass-effect border-white/10"}
        >
          {user ? "Progress Timeline" : "My Progress"}
        </Button>
        <Button
          onClick={handleCreateNew}
          variant={!showDashboard ? "default" : "outline"}
          className={!showDashboard ? "bg-accent hover:bg-accent/90" : "glass-effect border-white/10"}
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Create Progress Card
        </Button>
        {!user && (
          <Button
            onClick={() => setShowAuthModal(true)}
            variant="outline"
            className="glass-effect border-white/10"
          >
            <UserCircle className="w-4 h-4 mr-2" />
            Sign In to Save
          </Button>
        )}
      </div>
      {showDashboard ? (
        user ? (
          <Dashboard />
        ) : (
          <div className="space-y-8">
            {tempProfiles.length === 0 ? (
              <div className="text-center space-y-4">
                <div className="text-white">
                  <p className="text-xl font-semibold mb-2">Start Your Fitness Journey</p>
                  <p>Create your first progress card to track your transformation.</p>
                  <p className="text-sm text-white/60 mt-2">Sign in to save your progress permanently.</p>
                </div>
                <Button
                  onClick={handleCreateNew}
                  className="bg-accent hover:bg-accent/90"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Create Your First Progress Card
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {tempProfiles.map((profile, index) => (
                  <div key={index} className="relative">
                    <div className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded-full z-10">
                      Temporary
                    </div>
                    <ProfileCard {...profile} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      ) : (
        <FitnessChallenge onProfileCreated={handleProfileCreated} />
      )}
      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  )
}

