import React, { createContext, useContext, useState, useEffect } from 'react'
import { db } from '../config/firebase'
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore'
import { useAuth } from './AuthContext'
import { saveSessionData, getSessionData } from '../utils/sessionManager'

const DataContext = createContext()

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within DataProvider')
  }
  return context
}

export const DataProvider = ({ children }) => {
  const { user, sessionId } = useAuth()
  const [students, setStudents] = useState([])
  const [testScores, setTestScores] = useState([])
  const [behavioralData, setBehavioralData] = useState([])
  const [grades, setGrades] = useState(['Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'])
  const [sections, setSections] = useState(['A', 'B', 'C', 'D', 'E'])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadUserData()
    } else {
      loadSessionData()
    }
  }, [user, sessionId])

  const loadUserData = () => {
    if (!db) {
      setLoading(false)
      return
    }

    const userId = user.uid
    
    const unsubStudents = onSnapshot(
      query(collection(db, 'students'), where('userId', '==', userId)),
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setStudents(data)
      }
    )

    const unsubScores = onSnapshot(
      query(collection(db, 'testScores'), where('userId', '==', userId)),
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setTestScores(data)
      }
    )

    const unsubBehavioral = onSnapshot(
      query(collection(db, 'behavioralData'), where('userId', '==', userId)),
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setBehavioralData(data)
      }
    )

    setLoading(false)

    return () => {
      unsubStudents()
      unsubScores()
      unsubBehavioral()
    }
  }

  const loadSessionData = () => {
    const data = getSessionData()
    setStudents(data.students || [])
    setTestScores(data.testScores || [])
    setBehavioralData(data.behavioralData || [])
    setLoading(false)
  }

  const saveToBackend = async (collectionName, data) => {
    if (user && db) {
      const dataWithUser = { ...data, userId: user.uid }
      if (data.id) {
        await updateDoc(doc(db, collectionName, data.id), dataWithUser)
      } else {
        const docRef = await addDoc(collection(db, collectionName), dataWithUser)
        return docRef.id
      }
    } else {
      const sessionData = getSessionData()
      const key = `${collectionName}`
      const existing = sessionData[key] || []
      
      if (data.id) {
        const index = existing.findIndex(item => item.id === data.id)
        if (index >= 0) {
          existing[index] = data
        }
      } else {
        data.id = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        existing.push(data)
      }
      
      saveSessionData({ [key]: existing })
      return data.id
    }
  }

  const addStudent = async (studentData) => {
    const id = await saveToBackend('students', studentData)
    if (!user) {
      setStudents(prev => [...prev, { ...studentData, id }])
    }
    return id
  }

  const updateStudent = async (studentId, updates) => {
    await saveToBackend('students', { id: studentId, ...updates })
    if (!user) {
      setStudents(prev => prev.map(s => s.id === studentId ? { ...s, ...updates } : s))
    }
  }

  const deleteStudent = async (studentId) => {
    if (user && db) {
      await deleteDoc(doc(db, 'students', studentId))
    } else {
      setStudents(prev => prev.filter(s => s.id !== studentId))
      const sessionData = getSessionData()
      saveSessionData({ 
        students: (sessionData.students || []).filter(s => s.id !== studentId) 
      })
    }
  }

  const addTestScore = async (scoreData) => {
    const id = await saveToBackend('testScores', scoreData)
    if (!user) {
      setTestScores(prev => [...prev, { ...scoreData, id }])
    }
    return id
  }

  const updateTestScore = async (scoreId, updates) => {
    await saveToBackend('testScores', { id: scoreId, ...updates })
    if (!user) {
      setTestScores(prev => prev.map(s => s.id === scoreId ? { ...s, ...updates } : s))
    }
  }

  const deleteTestScore = async (scoreId) => {
    if (user) {
      await deleteDoc(doc(db, 'testScores', scoreId))
    } else {
      setTestScores(prev => prev.filter(s => s.id !== scoreId))
      const sessionData = getSessionData()
      saveSessionData({ 
        testScores: (sessionData.testScores || []).filter(s => s.id !== scoreId) 
      })
    }
  }

  const addBehavioralData = async (behavioralEntry) => {
    const id = await saveToBackend('behavioralData', behavioralEntry)
    if (!user) {
      setBehavioralData(prev => [...prev, { ...behavioralEntry, id }])
    }
    return id
  }

  const updateBehavioralData = async (entryId, updates) => {
    await saveToBackend('behavioralData', { id: entryId, ...updates })
    if (!user) {
      setBehavioralData(prev => prev.map(b => b.id === entryId ? { ...b, ...updates } : b))
    }
  }

  const deleteBehavioralData = async (entryId) => {
    if (user && db) {
      await deleteDoc(doc(db, 'behavioralData', entryId))
    } else {
      setBehavioralData(prev => prev.filter(b => b.id !== entryId))
      const sessionData = getSessionData()
      saveSessionData({ 
        behavioralData: (sessionData.behavioralData || []).filter(b => b.id !== entryId) 
      })
    }
  }

  const getStudentsBySection = (grade, section) => {
    return students.filter(s => s.grade === grade && s.section === section)
  }

  const getTestScoresByStudent = (studentId) => {
    return testScores.filter(s => s.studentId === studentId)
  }

  const getBehavioralDataByStudent = (studentId) => {
    return behavioralData.filter(b => b.studentId === studentId)
  }

  const value = {
    students,
    testScores,
    behavioralData,
    grades,
    sections,
    loading,
    addStudent,
    updateStudent,
    deleteStudent,
    addTestScore,
    updateTestScore,
    deleteTestScore,
    addBehavioralData,
    updateBehavioralData,
    deleteBehavioralData,
    getStudentsBySection,
    getTestScoresByStudent,
    getBehavioralDataByStudent
  }

  return (
    <DataContext.Provider value={value}>
      {!loading && children}
    </DataContext.Provider>
  )
}
