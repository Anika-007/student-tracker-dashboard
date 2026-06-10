const SESSION_KEY = 'student_tracker_session_id'
const SESSION_DATA_KEY = 'student_tracker_session_data'

export const getSessionId = () => {
  let sessionId = localStorage.getItem(SESSION_KEY)
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem(SESSION_KEY, sessionId)
  }
  return sessionId
}

export const saveSessionData = (data) => {
  const sessionData = getSessionData()
  const updatedData = { ...sessionData, ...data }
  localStorage.setItem(SESSION_DATA_KEY, JSON.stringify(updatedData))
}

export const getSessionData = () => {
  const data = localStorage.getItem(SESSION_DATA_KEY)
  return data ? JSON.parse(data) : {}
}

export const clearSessionData = () => {
  localStorage.removeItem(SESSION_DATA_KEY)
}

export const hasSessionData = () => {
  const data = getSessionData()
  return Object.keys(data).length > 0
}
