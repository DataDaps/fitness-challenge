'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'
import { toast } from 'sonner'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function useAuth() {
  return useContext(AuthContext)
}

const handleAuthError = (error: any) => {
  console.error('Authentication error:', error)
  const errorMessage = error.message || 'An error occurred during authentication'
  toast.error(errorMessage)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      await setPersistence(auth, browserLocalPersistence)
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      handleAuthError(error)
      throw error
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      await setPersistence(auth, browserLocalPersistence)
      await createUserWithEmailAndPassword(auth, email, password)
    } catch (error) {
      handleAuthError(error)
      throw error
    }
  }

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (error) {
      handleAuthError(error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      toast.success('Successfully signed out!')
    } catch (error) {
      handleAuthError(error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signInWithGoogle, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

