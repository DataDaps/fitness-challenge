import { db } from './firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

export interface UserProfileData {
  name: string
  age: number
  height: number
  updatedAt: number
}

export async function saveUserProfileData(userId: string, data: Omit<UserProfileData, 'updatedAt'>) {
  try {
    const userProfileRef = doc(db, 'users', userId)
    await setDoc(userProfileRef, {
      ...data,
      updatedAt: Date.now()
    }, { merge: true })
  } catch (error) {
    console.error('Error saving user profile:', error)
    throw new Error('Failed to save user profile')
  }
}

export async function getUserProfileData(userId: string): Promise<UserProfileData | null> {
  try {
    const userProfileRef = doc(db, 'users', userId)
    const docSnap = await getDoc(userProfileRef)
    
    if (docSnap.exists()) {
      return docSnap.data() as UserProfileData
    }
    
    return null
  } catch (error) {
    console.error('Error fetching user profile:', error)
    throw new Error('Failed to fetch user profile')
  }
} 