import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import ImageComparisonSlider from './image-comparison-slider'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Share2 } from 'lucide-react'
import { toast } from 'sonner'

interface ProfileCardProps {
  name: string
  age: number
  height: number
  weight: number
  chest: number
  waist: number
  hips: number
  beforeImage?: string
  afterImage?: string
  createdAt: number
  showPostToFeed?: boolean
  onPostToFeed?: () => void
}

export default function ProfileCard({
  name,
  age,
  height,
  weight,
  chest,
  waist,
  hips,
  beforeImage,
  afterImage,
  createdAt,
  showPostToFeed,
  onPostToFeed
}: ProfileCardProps) {
  return (
    <Card className="glass-card border-0">
      <CardHeader className="pb-4 px-8 pt-8">
        <CardTitle className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-accent to-accent/50">
          {name}'s Transformation
        </CardTitle>
        <p className="text-center text-sm text-muted-foreground">
          Created on {format(createdAt, 'MMMM d, yyyy')}
        </p>
      </CardHeader>
      <CardContent className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative aspect-square rounded-xl overflow-hidden">
            {beforeImage && afterImage && (
              <ImageComparisonSlider beforeImage={beforeImage} afterImage={afterImage} />
            )}
          </div>
          <div className="space-y-6">
            <div className="glass-effect rounded-xl p-6">
              <h3 className="text-2xl font-semibold mb-6 text-accent">Stats</h3>
              <div className="grid gap-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Age</span>
                  <span className="text-muted-foreground">{age} years</span>
                </div>
                <Separator className="bg-white/10" />
                <div className="flex justify-between items-center">
                  <span className="font-medium">Height</span>
                  <span className="text-muted-foreground">{height} cm</span>
                </div>
                <Separator className="bg-white/10" />
                <div className="flex justify-between items-center">
                  <span className="font-medium">Weight</span>
                  <span className="text-muted-foreground">{weight} kg</span>
                </div>
                <Separator className="bg-white/10" />
                <div className="flex justify-between items-center">
                  <span className="font-medium">Chest</span>
                  <span className="text-muted-foreground">{chest} cm</span>
                </div>
                <Separator className="bg-white/10" />
                <div className="flex justify-between items-center">
                  <span className="font-medium">Waist</span>
                  <span className="text-muted-foreground">{waist} cm</span>
                </div>
                <Separator className="bg-white/10" />
                <div className="flex justify-between items-center">
                  <span className="font-medium">Hips</span>
                  <span className="text-muted-foreground">{hips} cm</span>
                </div>
              </div>
            </div>
            {showPostToFeed && (
              <Button 
                onClick={onPostToFeed} 
                className="w-full bg-accent hover:bg-accent/90 transition-colors"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Post to Feed
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

