import { db, storage } from './firebase'
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  addDoc,
  orderBy,
  serverTimestamp,
  Timestamp,
  deleteDoc
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export interface UserProfile {
  id?: string
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
  userId: string
}

export async function saveUserProfile(userId: string, profile: Omit<UserProfile, 'userId' | 'id'>) {
  try {
    console.log('Attempting to save profile:', { userId, profile })
    
    if (!userId) {
      throw new Error('User ID is required')
    }

    if (!profile.name || profile.name.trim() === '') {
      throw new Error('Name is required')
    }

    // Create a reference to the profiles collection
    const profilesRef = collection(db, 'profiles')
    
    // Prepare the profile data with all required fields
    const profileData = {
      userid: userId,
      name: profile.name.trim(),
      createdAt: serverTimestamp(),
      age: profile.age || 0,
      height: profile.height || 0,
      weight: profile.weight || 0,
      chest: profile.chest || 0,
      waist: profile.waist || 0,
      hips: profile.hips || 0,
      beforeImage: profile.beforeImage || '',
      afterImage: profile.afterImage || ''
    }
    
    console.log('Saving profile data to Firestore:', profileData)
    
    try {
      // Add the profile as a new document
      const docRef = await addDoc(profilesRef, profileData)
      console.log('Profile saved successfully with ID:', docRef.id)
      return docRef.id
    } catch (firestoreError) {
      console.error('Firestore error details:', firestoreError)
      throw firestoreError
    }
  } catch (error) {
    console.error('Error saving user profile:', error)
    if (error instanceof Error) {
      throw new Error(`Failed to save profile: ${error.message}`)
    }
    throw new Error('Failed to save profile. Please try again later.')
  }
}

export async function getUserProfiles(userId: string): Promise<UserProfile[]> {
  try {
    if (!userId) {
      console.error('getUserProfiles called without userId')
      return []
    }

    console.log('Fetching profiles for user:', userId)
    
    // Query profiles collection for documents where userid matches
    const profilesRef = collection(db, 'profiles')
    const q = query(
      profilesRef, 
      where('userid', '==', userId),
      orderBy('createdAt', 'desc')
    )
    
    console.log('Executing Firestore query with params:', { userId })
    
    try {
      const querySnapshot = await getDocs(q)
      console.log('Query response:', querySnapshot)
      
      if (querySnapshot.empty) {
        console.log('No profiles found for user:', userId)
        return []
      }
      
      const profiles = querySnapshot.docs.map(doc => {
        const data = doc.data()
        console.log('Document data:', data)
        
        // Ensure createdAt is a valid number timestamp
        let createdAt = data.createdAt
        if (createdAt instanceof Timestamp) {
          createdAt = createdAt.toMillis()
        } else if (typeof createdAt !== 'number') {
          createdAt = Date.now() // Fallback to current time if invalid
        }
        
        return {
          ...data,
          id: doc.id,
          userId: data.userid,
          name: data.name || 'Unnamed Profile',
          createdAt,
          age: data.age || 0,
          height: data.height || 0,
          weight: data.weight || 0,
          chest: data.chest || 0,
          waist: data.waist || 0,
          hips: data.hips || 0,
          beforeImage: data.beforeImage || '',
          afterImage: data.afterImage || ''
        } as UserProfile
      })
      
      console.log('Fetched profiles:', profiles)
      return profiles
    } catch (queryError) {
      console.error('Query execution error:', queryError)
      throw queryError
    }
  } catch (error) {
    console.error('Error fetching user profiles:', error)
    if (error instanceof Error) {
      throw new Error(`Failed to fetch profiles: ${error.message}`)
    }
    throw error
  }
}

export async function uploadImage(userId: string, file: File, type: 'before' | 'after'): Promise<string> {
  try {
    console.log('Uploading image:', { userId, type, fileName: file.name })
    
    // Create folder structure using userId/type
    const imageRef = ref(storage, `images/${userId}/${type}-${Date.now()}`)
    await uploadBytes(imageRef, file)
    const url = await getDownloadURL(imageRef)
    
    console.log('Image uploaded successfully:', url)
    return url
  } catch (error) {
    console.error('Error uploading image:', error)
    if (error instanceof Error) {
      throw new Error(`Failed to upload image: ${error.message}`)
    }
    throw new Error('Failed to upload image. Please try again later.')
  }
}

export async function updateUserProfile(userId: string, profileId: string, updates: Partial<Omit<UserProfile, 'id' | 'userId' | 'createdAt'>>) {
  try {
    if (!userId || !profileId) {
      throw new Error('User ID and Profile ID are required')
    }

    // Get reference to the profile document
    const profileRef = doc(db, 'profiles', profileId)
    
    // Get the current profile data
    const profileSnap = await getDoc(profileRef)
    if (!profileSnap.exists()) {
      throw new Error('Profile not found')
    }
    
    // Verify ownership
    const profileData = profileSnap.data()
    if (profileData.userid !== userId) {
      throw new Error('Unauthorized to edit this profile')
    }

    // Update only allowed fields
    const allowedUpdates: Record<string, number | undefined> = {
      weight: updates.weight,
      chest: updates.chest,
      waist: updates.waist,
      hips: updates.hips,
    }

    // Remove undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(allowedUpdates).filter(([_, value]) => value !== undefined)
    )

    await setDoc(profileRef, cleanUpdates, { merge: true })
    console.log('Profile updated successfully')
    
    return profileId
  } catch (error) {
    console.error('Error updating profile:', error)
    if (error instanceof Error) {
      throw new Error(`Failed to update profile: ${error.message}`)
    }
    throw new Error('Failed to update profile')
  }
}

export async function deleteUserProfile(userId: string, profileId: string) {
  try {
    if (!userId || !profileId) {
      throw new Error('User ID and Profile ID are required')
    }

    // Get reference to the profile document
    const profileRef = doc(db, 'profiles', profileId)
    
    // Get the current profile data
    const profileSnap = await getDoc(profileRef)
    if (!profileSnap.exists()) {
      throw new Error('Profile not found')
    }
    
    // Verify ownership
    const profileData = profileSnap.data()
    if (profileData.userid !== userId) {
      throw new Error('Unauthorized to delete this profile')
    }

    // Delete the profile
    await deleteDoc(profileRef)
    console.log('Profile deleted successfully')
  } catch (error) {
    console.error('Error deleting profile:', error)
    if (error instanceof Error) {
      throw new Error(`Failed to delete profile: ${error.message}`)
    }
    throw new Error('Failed to delete profile')
  }
}

export async function getAllProfiles(): Promise<UserProfile[]> {
  try {
    console.log('Fetching all profiles for feed')
    
    // Query profiles collection for all documents
    const profilesRef = collection(db, 'profiles')
    const q = query(
      profilesRef,
      orderBy('createdAt', 'desc')
    )
    
    const querySnapshot = await getDocs(q)
    console.log('Query response:', querySnapshot)
    
    if (querySnapshot.empty) {
      console.log('No profiles found')
      return []
    }
    
    const profiles = querySnapshot.docs.map(doc => {
      const data = doc.data()
      console.log('Document data:', data)
      
      // Ensure createdAt is a valid number timestamp
      let createdAt = data.createdAt
      if (createdAt instanceof Timestamp) {
        createdAt = createdAt.toMillis()
      } else if (typeof createdAt !== 'number') {
        createdAt = Date.now() // Fallback to current time if invalid
      }
      
      return {
        ...data,
        id: doc.id,
        userId: data.userid,
        name: data.name || 'Unnamed Profile',
        createdAt,
        age: data.age || 0,
        height: data.height || 0,
        weight: data.weight || 0,
        chest: data.chest || 0,
        waist: data.waist || 0,
        hips: data.hips || 0,
        beforeImage: data.beforeImage || '',
        afterImage: data.afterImage || ''
      } as UserProfile
    })
    
    console.log('Fetched all profiles:', profiles)
    return profiles
  } catch (error) {
    console.error('Error fetching all profiles:', error)
    if (error instanceof Error) {
      throw new Error(`Failed to fetch profiles: ${error.message}`)
    }
    throw error
  }
}

