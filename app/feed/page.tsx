'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { getAllProfiles, type UserProfile } from '@/lib/user-service'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import ProfileCard from '@/components/profile-card'
import { toast } from 'sonner'

type SortOption = 'newest' | 'progress' | 'date'

export default function FeedPage() {
  const { user } = useAuth()
  const [profiles, setProfiles] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<SortOption>('newest')

  const filterValidProfiles = (profiles: UserProfile[]) => {
    return profiles.filter(profile => 
      profile.name && // Has a name
      profile.beforeImage && profile.afterImage // Has both images
    )
  }

  useEffect(() => {
    async function loadProfiles() {
      if (!user) return

      try {
        const allProfiles = await getAllProfiles()
        const validProfiles = filterValidProfiles(allProfiles)
        setProfiles(sortProfiles(validProfiles, sortBy))
      } catch (error) {
        console.error('Error loading profiles:', error)
        toast.error('Failed to load community feed')
      } finally {
        setLoading(false)
      }
    }

    loadProfiles()
  }, [user, sortBy])

  const calculateProgress = (profile: UserProfile) => {
    const weightLoss = profile.weight ? (profile.weight - (profile.weight * 0.9)) : 0
    const waistReduction = profile.waist ? (profile.waist - (profile.waist * 0.9)) : 0
    return weightLoss + waistReduction
  }

  const sortProfiles = (profilesToSort: UserProfile[], option: SortOption) => {
    switch (option) {
      case 'newest':
        return [...profilesToSort].sort((a, b) => b.createdAt - a.createdAt)
      case 'progress':
        return [...profilesToSort].sort((a, b) => calculateProgress(b) - calculateProgress(a))
      case 'date':
        return [...profilesToSort].sort((a, b) => a.createdAt - b.createdAt)
      default:
        return profilesToSort
    }
  }

  if (!user) return null

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Community Feed</h1>
        <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
          <SelectTrigger className="w-[180px] bg-black/20 border-white/10 text-white">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-black/90 border-white/10">
            <SelectItem value="newest" className="text-white hover:bg-white/10">Newest First</SelectItem>
            <SelectItem value="progress" className="text-white hover:bg-white/10">Most Progress</SelectItem>
            <SelectItem value="date" className="text-white hover:bg-white/10">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {profiles.length === 0 ? (
            <Card className="border-0 bg-black/20">
              <CardContent className="p-8 text-center">
                <p className="text-lg text-white">No progress cards found in the community feed.</p>
              </CardContent>
            </Card>
          ) : (
            profiles.map((profile) => (
              <div key={profile.id} className="relative">
                <ProfileCard {...profile} />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
} 