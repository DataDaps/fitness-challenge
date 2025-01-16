'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/auth-context'
import { getUserProfileData } from '@/lib/user-profile-service'
import { toast } from 'sonner'

interface PersonalDetailsFormData {
  name: string
  age: number
  height: number
  weight: number
  chest: number
  waist: number
  hips: number
}

interface PersonalDetailsFormProps {
  onSubmit: (data: PersonalDetailsFormData) => void
  isSubmitting?: boolean
  initialData?: Partial<PersonalDetailsFormData>
}

export default function PersonalDetailsForm({ onSubmit, isSubmitting, initialData }: PersonalDetailsFormProps) {
  const { user } = useAuth()
  const [formData, setFormData] = useState<PersonalDetailsFormData>({
    name: '',
    age: 0,
    height: 0,
    weight: 0,
    chest: 0,
    waist: 0,
    hips: 0,
    ...initialData
  })

  useEffect(() => {
    async function loadUserProfile() {
      if (user) {
        try {
          const profile = await getUserProfileData(user.uid)
          if (profile) {
            setFormData(prev => ({
              ...prev,
              name: profile.name || prev.name,
              age: profile.age || prev.age,
              height: profile.height || prev.height
            }))
          }
        } catch (error) {
          console.error('Error loading user profile:', error)
        }
      }
    }
    loadUserProfile()
  }, [user])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      toast.error('Name is required')
      return
    }
    onSubmit(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'name' ? value : Number(value)
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your name"
          required
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            name="age"
            type="number"
            min="0"
            value={formData.age}
            onChange={handleChange}
            placeholder="Enter your age"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="height">Height (cm)</Label>
          <Input
            id="height"
            name="height"
            type="number"
            min="0"
            step="0.1"
            value={formData.height}
            onChange={handleChange}
            placeholder="Enter your height"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            name="weight"
            type="number"
            min="0"
            step="0.1"
            value={formData.weight}
            onChange={handleChange}
            placeholder="Enter your weight"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="chest">Chest (cm)</Label>
          <Input
            id="chest"
            name="chest"
            type="number"
            min="0"
            step="0.1"
            value={formData.chest}
            onChange={handleChange}
            placeholder="Enter chest measurement"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="waist">Waist (cm)</Label>
          <Input
            id="waist"
            name="waist"
            type="number"
            min="0"
            step="0.1"
            value={formData.waist}
            onChange={handleChange}
            placeholder="Enter waist measurement"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hips">Hips (cm)</Label>
          <Input
            id="hips"
            name="hips"
            type="number"
            min="0"
            step="0.1"
            value={formData.hips}
            onChange={handleChange}
            placeholder="Enter hips measurement"
          />
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save Progress Card'}
      </Button>
    </form>
  )
}

