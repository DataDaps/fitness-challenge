'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { getUserProfiles, updateUserProfile, deleteUserProfile, type UserProfile } from '@/lib/user-service'
import { Card, CardContent } from '@/components/ui/card'
import ProfileCard from './profile-card'
import { Button } from '@/components/ui/button'
import { PlusCircle, Calendar, TrendingUp, Award, TrendingDown, Activity } from 'lucide-react'
import { format } from 'date-fns'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import PersonalDetailsForm from './personal-details-form'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const router = useRouter()
  const { user } = useAuth()
  const [profiles, setProfiles] = useState<UserProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingProfile, setEditingProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const handleCreateNew = () => {
    router.push('/new')
  }

  useEffect(() => {
    if (user) {
      setIsLoading(true)
      getUserProfiles(user.uid)
        .then(profiles => {
          // Sort profiles by date, newest first
          setProfiles(profiles.sort((a, b) => b.createdAt - a.createdAt))
        })
        .finally(() => setIsLoading(false))
    }
  }, [user])

  const handleEdit = async (updates: Partial<UserProfile>) => {
    if (!user || !editingProfile?.id) return

    try {
      await updateUserProfile(user.uid, editingProfile.id, updates)
      // Refresh profiles
      const updatedProfiles = await getUserProfiles(user.uid)
      setProfiles(updatedProfiles.sort((a, b) => b.createdAt - a.createdAt))
      setEditingProfile(null)
      setIsEditing(false)
      toast.success('Progress card updated successfully!')
    } catch (error) {
      toast.error('Failed to update progress card')
    }
  }

  const handleDelete = async (profileId: string) => {
    if (!user) return

    try {
      await deleteUserProfile(user.uid, profileId)
      setProfiles(profiles.filter(p => p.id !== profileId))
      toast.success('Progress card deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete progress card')
    }
  }

  const calculateProgress = () => {
    if (profiles.length < 2) return null

    const firstProfile = profiles[profiles.length - 1]
    const latestProfile = profiles[0]
    const daysSinceStart = Math.floor((latestProfile.createdAt - firstProfile.createdAt) / (1000 * 60 * 60 * 24))
    const weightLoss = firstProfile.weight - latestProfile.weight
    const waistReduction = firstProfile.waist - latestProfile.waist
    const progressPercentage = Math.min(100, Math.round(((weightLoss / firstProfile.weight) + (waistReduction / firstProfile.waist)) * 50))

    return {
      daysSinceStart,
      weightLoss: weightLoss > 0 ? weightLoss : 0,
      waistReduction: waistReduction > 0 ? waistReduction : 0,
      progressPercentage
    }
  }

  const progress = calculateProgress()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Your Fitness Journey</h2>
        <Button onClick={handleCreateNew} className="bg-accent hover:bg-accent/90">
          <PlusCircle className="mr-2 h-4 w-4" /> New Progress Card
        </Button>
      </div>

      {profiles.length === 0 ? (
        <Card className="glass-card border-0">
          <CardContent className="p-8 text-center">
            <p className="text-lg text-white mb-4">Ready to start tracking your fitness journey?</p>
            <Button onClick={handleCreateNew} className="bg-accent hover:bg-accent/90">
              <PlusCircle className="mr-2 h-4 w-4" /> Create Your First Progress Card
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Stats Cards */}
          {progress && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-black/20 backdrop-blur-xl rounded-lg p-6 flex items-center gap-4">
                <div className="p-3 bg-accent/10 rounded-full">
                  <TrendingDown className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Weight Loss</p>
                  <p className="text-2xl font-bold">{progress.weightLoss.toFixed(1)} kg</p>
                </div>
              </div>
              
              <div className="bg-black/20 backdrop-blur-xl rounded-lg p-6 flex items-center gap-4">
                <div className="p-3 bg-accent/10 rounded-full">
                  <TrendingDown className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Waist Reduction</p>
                  <p className="text-2xl font-bold">{progress.waistReduction.toFixed(1)} cm</p>
                </div>
              </div>
              
              <div className="bg-black/20 backdrop-blur-xl rounded-lg p-6 flex items-center gap-4">
                <div className="p-3 bg-accent/10 rounded-full">
                  <Calendar className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Days in Journey</p>
                  <p className="text-2xl font-bold">{progress.daysSinceStart}</p>
                </div>
              </div>
              
              <div className="bg-black/20 backdrop-blur-xl rounded-lg p-6 flex items-center gap-4">
                <div className="p-3 bg-accent/10 rounded-full">
                  <Activity className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Overall Progress</p>
                  <p className="text-2xl font-bold">{progress.progressPercentage}%</p>
                </div>
              </div>
            </div>
          )}

          {/* Progress Cards */}
          <div className="space-y-6">
            {profiles.map((profile, index) => (
              <div key={profile.id} className="relative">
                {index === 0 && (
                  <div className="absolute -top-2 -right-2 bg-accent text-white text-xs px-2 py-1 rounded-full z-10">
                    Latest
                  </div>
                )}
                <div className="mb-2 flex justify-between items-center">
                  <span className="text-sm text-white/60">
                    {format(profile.createdAt, 'MMMM d, yyyy')}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingProfile(profile)
                        setIsEditing(true)
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => handleDelete(profile.id!)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
                <ProfileCard {...profile} />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Edit Dialog */}
      {isEditing && editingProfile && (
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Progress Card</DialogTitle>
            </DialogHeader>
            <PersonalDetailsForm
              onSubmit={handleEdit}
              initialData={editingProfile}
              isSubmitting={false}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

