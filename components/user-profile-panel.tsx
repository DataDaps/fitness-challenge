import { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/auth-context'
import { UserCircle } from 'lucide-react'
import { toast } from 'sonner'

interface UserProfileData {
  name: string
  age: number
  height: number
}

interface UserProfilePanelProps {
  onProfileUpdate: (data: UserProfileData) => void
  defaultValues?: UserProfileData
}

export function UserProfilePanel({ onProfileUpdate, defaultValues }: UserProfilePanelProps) {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState<UserProfileData>(defaultValues || {
    name: '',
    age: 0,
    height: 0
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      toast.error('Name is required')
      return
    }
    onProfileUpdate(formData)
    setIsOpen(false)
    toast.success('Profile updated successfully!')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'name' ? value : Number(value)
    }))
  }

  if (!user) return null

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          id="user-profile-trigger"
          variant="ghost"
          size="icon"
          className="relative"
        >
          <UserCircle className="h-5 w-5" />
          {formData.name && (
            <span className="ml-2 text-sm hidden md:inline-block">
              {formData.name}
            </span>
          )}
          {defaultValues?.name && (
            <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>User Profile</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
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
          <Button type="submit" className="w-full">
            Save Profile
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
} 