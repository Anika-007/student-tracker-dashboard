import React, { createContext, useContext, useState, useEffect } from 'react'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInAnonymously
} from 'firebase/auth'
import { auth, db } from '../config/firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { getSessionId, getSessionData, clearSessionData, hasSessionData } from '../utils/sessionManager'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sessionId, setSessionId] = useState(null)

  useEffect(() => {
    const sid = getSessionId()
    setSessionId(sid)

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        
        if (hasSessionData()) {
          await migrateSessionData(firebaseUser.uid)
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const migrateSessionData = async (userId) => {
    try {
      const sessionData = getSessionData()
      if (Object.keys(sessionData).length > 0) {
        const userDocRef = doc(db, 'users', userId)
        const userDoc = await getDoc(userDocRef)
        
        if (!userDoc.exists()) {
          await setDoc(userDocRef, {
            sessionData,
            migratedAt: new Date().toISOString()
          })
        } else {
          await setDoc(userDocRef, {
            sessionData: {
              ...userDoc.data().sessionData,
              ...sessionData
            },
            lastMigration: new Date().toISOString()
          }, { merge: true })
        }
        
        clearSessionData()
      }
    } catch (error) {
      console.error('Error migrating session data:', error)
    }
  }

  const signIn = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      return result.user
    } catch (error) {
      throw error
    }
  }

  const signUp = async (email, password) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      return result.user
    } catch (error) {
      throw error
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
    } catch (error) {
      throw error
    }
  }

  const value = {
    user,
    sessionId,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
