'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { FcGoogle } from 'react-icons/fc'

interface AuthFormProps {
  onSuccess?: () => void
}

export default function AuthForm({ onSuccess }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signIn, signUp, signInWithGoogle } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isLogin) {
        await signIn(email, password)
        toast.success('Successfully signed in!')
      } else {
        await signUp(email, password)
        toast.success('Account created successfully!')
      }
      onSuccess?.()
    } catch (error) {
      toast.error('Authentication failed. Please try again.')
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
      toast.success('Successfully signed in with Google!')
      onSuccess?.()
    } catch (error) {
      toast.error('Google sign-in failed. Please try again.')
    }
  }

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          {isLogin ? 'Sign In' : 'Create Account'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="glass-effect border-white/10"
              required
            />
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="glass-effect border-white/10"
              required
            />
          </div>
          <Button type="submit" className="w-full bg-accent hover:bg-accent/90">
            {isLogin ? 'Sign In' : 'Create Account'}
          </Button>
        </form>
        <div className="mt-4">
          <Button
            type="button"
            variant="outline"
            className="w-full glass-effect border-white/10 flex items-center justify-center gap-2"
            onClick={handleGoogleSignIn}
          >
            <FcGoogle size={20} />
            Sign in with Google
          </Button>
        </div>
        <Button
          type="button"
          variant="ghost"
          className="w-full mt-4"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
        </Button>
      </CardContent>
    </>
  )
}

