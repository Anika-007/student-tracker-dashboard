import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { DataProvider } from './contexts/DataContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import DataSynthesis from './pages/DataSynthesis'
import Settings from './pages/Settings'

function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/synthesis" element={<DataSynthesis />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Layout>
        </DataProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
