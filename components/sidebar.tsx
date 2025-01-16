'use client'

import { useRouter, usePathname } from 'next/navigation'
import { LayoutDashboard, Users, LogOut, Upload } from 'lucide-react'
import { Button } from './ui/button'
import { useAuth } from '@/contexts/auth-context'
import { cn } from '@/lib/utils'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { UserProfilePanel } from './user-profile-panel'
import { getUserProfileData } from '@/lib/user-profile-service'
import { useEffect, useState } from 'react'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '@/lib/firebase'
import { toast } from 'sonner'

export default function Sidebar() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [profileData, setProfileData] = useState<{ name?: string, photoURL?: string } | null>(null)

  useEffect(() => {
    if (user) {
      getUserProfileData(user.uid).then(data => {
        if (data) {
          setProfileData({ name: data.name, photoURL: user.photoURL || undefined })
        }
      })
    }
  }, [user])

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !event.target.files?.[0]) return

    try {
      const file = event.target.files[0]
      const imageRef = ref(storage, `avatars/${user.uid}`)
      await uploadBytes(imageRef, file)
      const url = await getDownloadURL(imageRef)
      setProfileData(prev => ({ ...prev, photoURL: url }))
      toast.success('Profile photo updated successfully!')
    } catch (error) {
      console.error('Error uploading profile photo:', error)
      toast.error('Failed to update profile photo')
    }
  }

  if (!user) return null

  const initials = profileData?.name
    ? profileData.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : user.email?.[0].toUpperCase() || 'U'

  return (
    <div className="w-48 sticky top-0 h-screen">
      <div className="w-full h-full bg-black/20 backdrop-blur-xl border-r border-white/10 flex flex-col items-center py-8">
        <div className="flex-1 flex flex-col items-center gap-4">
          <Button
            variant="ghost"
            className={cn(
              "w-full flex items-center gap-4 px-4 py-2 hover:bg-white/10",
              pathname === '/dashboard' && "bg-white/10"
            )}
            onClick={() => router.push('/dashboard')}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Your Progress</span>
          </Button>
          <Button
            variant="ghost"
            className={cn(
              "w-full flex items-center gap-4 px-4 py-2 hover:bg-white/10",
              pathname === '/feed' && "bg-white/10"
            )}
            onClick={() => router.push('/feed')}
          >
            <Users className="h-5 w-5" />
            <span>Community Feed</span>
          </Button>
        </div>

        <div className="relative group">
          <Avatar className="h-16 w-16 border-2 border-accent cursor-pointer transition-transform hover:scale-105">
            {profileData?.photoURL ? (
              <AvatarImage src={profileData.photoURL} alt={profileData.name || 'User'} />
            ) : (
              <AvatarFallback className="bg-accent text-2xl">{initials}</AvatarFallback>
            )}
          </Avatar>
          <label className="absolute bottom-0 right-0 p-1 bg-accent rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
            <Upload className="h-4 w-4 text-white" />
            <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
          </label>
        </div>

        <Button
          variant="ghost"
          className="mt-4 text-red-500 hover:text-red-600 hover:bg-white/10"
          onClick={() => {
            logout()
            router.push('/')
          }}
        >
          <LogOut className="h-5 w-5 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  )
} 