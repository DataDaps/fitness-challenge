'use client'

import FitnessChallenge from '@/components/fitness-challenge'
import { useRouter } from 'next/navigation'

export default function CreatePage() {
  const router = useRouter()

  return (
    <div className="container py-8">
      <FitnessChallenge 
        onProfileCreated={() => router.push('/dashboard')}
      />
    </div>
  )
} 