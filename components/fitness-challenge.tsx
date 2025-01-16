'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { saveUserProfile, uploadImage, type UserProfile } from '@/lib/user-service'
import { useAuth } from '@/contexts/auth-context'
import PersonalDetailsForm from './personal-details-form'
import { Card, CardContent } from '@/components/ui/card'
import ImageUpload from './image-upload'

interface FitnessChallengeProps {
  onProfileCreated?: (profileId: string) => void
}

export default function FitnessChallenge({ onProfileCreated }: FitnessChallengeProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [beforeImage, setBeforeImage] = useState<string | null>(null)
  const [afterImage, setAfterImage] = useState<string | null>(null)
  const [personalDetails, setPersonalDetails] = useState<Omit<UserProfile, 'beforeImage' | 'afterImage' | 'createdAt' | 'userId' | 'id'> | null>(null)

  const handleImageUpload = async (file: File, type: 'before' | 'after') => {
    try {
      if (!user) {
        toast.error('Please sign in to upload images')
        return
      }

      const url = await uploadImage(user.uid, file, type)
      if (type === 'before') setBeforeImage(url)
      else setAfterImage(url)
      toast.success(`${type} image uploaded successfully!`)
    } catch (error) {
      console.error(`Error uploading ${type} image:`, error)
      toast.error(`Failed to upload ${type} image. Please try again.`)
    }
  }

  const handleDetailsSubmit = (details: Omit<UserProfile, 'beforeImage' | 'afterImage' | 'createdAt' | 'userId' | 'id'>) => {
    setPersonalDetails(details)
    handleSaveChanges(details)
  }

  const handleSaveChanges = async (details: Omit<UserProfile, 'userId' | 'id' | 'createdAt'>) => {
    if (isSubmitting || !beforeImage || !afterImage) {
      toast.error('Please upload both before and after images')
      return
    }
    
    setIsSubmitting(true)

    try {
      if (!user) {
        toast.error('Please sign in to save your progress card')
        return
      }

      const profileId = await saveUserProfile(user.uid, {
        ...details,
        beforeImage,
        afterImage,
        createdAt: Date.now()
      })
      
      toast.success('Progress card saved successfully!')
      
      if (onProfileCreated) {
        onProfileCreated(profileId)
      }
      
      // Navigate to dashboard after successful save
      router.push('/dashboard')
    } catch (error) {
      console.error('Error saving progress card:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to save progress card'
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Create New Progress Card</h1>
      
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Progress Photos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Before Photo</h3>
              <ImageUpload
                onImageUpload={(file) => handleImageUpload(file, 'before')}
                previewUrl={beforeImage}
                className="aspect-square"
              />
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">After Photo</h3>
              <ImageUpload
                onImageUpload={(file) => handleImageUpload(file, 'after')}
                previewUrl={afterImage}
                className="aspect-square"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Body Measurements</h2>
          <PersonalDetailsForm 
            onSubmit={handleDetailsSubmit}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  )
}

