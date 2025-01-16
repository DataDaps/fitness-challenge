import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyCqnOOUixunJGQkzhjbh7JwiRGXvxU0UGM",
  authDomain: "framer-components-54c98.firebaseapp.com",
  databaseURL: "framer-components-54c98-default-rtdb.firebaseio.com",
  projectId: "framer-components-54c98",
  storageBucket: "framer-components-54c98.firebasestorage.app",
  messagingSenderId: "835882270736",
  appId: "1:835882270736:web:d04d47f16292cbc9c18a95",
  measurementId: "G-KPKVLP185Z"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Auth with persistence
export const auth = getAuth(app)
auth.useDeviceLanguage() // Set language to device default

// Initialize Firestore
export const db = getFirestore(app, 'fitness-tracker')

// Initialize Storage
export const storage = getStorage(app)

// Configure Google Provider
export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({
  prompt: 'select_account'
})

export default app

