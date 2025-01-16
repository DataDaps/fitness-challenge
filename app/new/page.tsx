'use client'

import FitnessChallenge from '@/components/fitness-challenge'
import { useRouter } from 'next/navigation'

export default function NewProgressPage() {
  const router = useRouter()

  const handleProfileCreated = (profileId: string) => {
    router.push('/dashboard')
  }

  return (
    <div className="container mx-auto px-4">
      <FitnessChallenge onProfileCreated={handleProfileCreated} />
    </div>
  )
} 