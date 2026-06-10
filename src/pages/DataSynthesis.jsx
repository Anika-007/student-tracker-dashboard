import React, { useState, useEffect } from 'react'
import { useData } from '../contexts/DataContext'
import { useAuth } from '../contexts/AuthContext'
import { Download, TrendingUp, Users, Award } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { generateStudentInsights, generateSectionInsights } from '../utils/aiInsights'
import { exportToGoogleSheets, loadGoogleSheetsAPI } from '../utils/googleSheets'

const DataSynthesis = () => {
  const { students, testScores, behavioralData, grades, sections, getTestScoresByStudent, getBehavioralDataByStudent } = useData()
  const { user } = useAuth()
  const [selectedGrade, setSelectedGrade] = useState('')
  const [selectedSection, setSelectedSection] = useState('')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [viewMode, setViewMode] = useState('section')
  const [studentInsights, setStudentInsights] = useState(null)
  const [sectionInsights, setSectionInsights] = useState(null)
  const [loadingInsights, setLoadingInsights] = useState(false)

  useEffect(() => {
    loadGoogleSheetsAPI().catch(console.error)
  }, [])

  useEffect(() => {
    if (viewMode === 'student' && selectedStudent) {
      generateStudentInsightsData()
    } else if (viewMode === 'section' && selectedGrade && selectedSection) {
      generateSectionInsightsData()
    }
  }, [viewMode, selectedStudent, selectedGrade, selectedSection, testScores, behavioralData])

  const generateStudentInsightsData = async () => {
    if (!selectedStudent) return
    
    setLoadingInsights(true)
    const scores = getTestScoresByStudent(selectedStudent.id)
    const behavioral = getBehavioralDataByStudent(selectedStudent.id)
    
    const insights = await generateStudentInsights(selectedStudent, scores, behavioral)
    setStudentInsights(insights)
    setLoadingInsights(false)
  }

  const generateSectionInsightsData = async () => {
    if (!selectedGrade || !selectedSection) return
    
    setLoadingInsights(true)
    const sectionStudents = students.filter(s => s.grade === selectedGrade && s.section === selectedSection)
    const sectionData = {
      testScores: testScores.filter(ts => sectionStudents.some(s => s.id === ts.studentId)),
      behavioralData: behavioralData.filter(bd => sectionStudents.some(s => s.id === bd.studentId))
    }
    
    const insights = await generateSectionInsights(sectionData, sectionStudents)
    setSectionInsights(insights)
    setLoadingInsights(false)
  }

  const handleExportToSheets = async () => {
    const exportData = {
      students,
      testScores,
      behavioralData
    }
    await exportToGoogleSheets(exportData, user)
  }

  const filteredStudents = students.filter(s =>
    (!selectedGrade || s.grade === selectedGrade) &&
    (!selectedSection || s.section === selectedSection)
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Data Synthesis</h1>
        <button
          onClick={handleExportToSheets}
          className="btn-primary inline-flex items-center"
        >
          <Download className="w-4 h-4 mr-2" />
          Export to Google Sheets
        </button>
      </div>

      <div className="card">
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setViewMode('section')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'section'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Section View
          </button>
          <button
            onClick={() => setViewMode('student')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'student'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Award className="w-4 h-4 inline mr-2" />
            Student View
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">Grade</label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="input-field"
            >
              <option value="">Select Grade</option>
              {grades.map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Section</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="input-field"
            >
              <option value="">Select Section</option>
              {sections.map(section => (
                <option key={section} value={section}>Section {section}</option>
              ))}
            </select>
          </div>

          {viewMode === 'student' && (
            <div>
              <label className="label">Student</label>
              <select
                value={selectedStudent?.id || ''}
                onChange={(e) => {
                  const student = filteredStudents.find(s => s.id === e.target.value)
                  setSelectedStudent(student)
                }}
                className="input-field"
              >
                <option value="">Select Student</option>
                {filteredStudents.map(student => (
                  <option key={student.id} value={student.id}>{student.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {viewMode === 'student' && selectedStudent ? (
        <StudentView
          student={selectedStudent}
          testScores={getTestScoresByStudent(selectedStudent.id)}
          behavioralData={getBehavioralDataByStudent(selectedStudent.id)}
          insights={studentInsights}
          loadingInsights={loadingInsights}
        />
      ) : viewMode === 'section' && selectedGrade && selectedSection ? (
        <SectionView
          grade={selectedGrade}
          section={selectedSection}
          students={filteredStudents}
          testScores={testScores}
          insights={sectionInsights}
          loadingInsights={loadingInsights}
        />
      ) : (
        <div className="card text-center py-12">
          <p className="text-gray-500">
            {viewMode === 'student' 
              ? 'Select a grade, section, and student to view insights'
              : 'Select a grade and section to view class insights'}
          </p>
        </div>
      )}
    </div>
  )
}

const StudentView = ({ student, testScores, behavioralData, insights, loadingInsights }) => {
  const chartData = testScores
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map(score => ({
      date: new Date(score.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: score.score,
      testName: score.testName
    }))

  const wordFrequency = {}
  behavioralData.forEach(entry => {
    [...(entry.selfWords || []), ...(entry.peerWords || [])].forEach(word => {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1
    })
  })

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{student.name}</h2>
        <p className="text-gray-600">{student.grade} - Section {student.section}</p>
      </div>

      {loadingInsights ? (
        <div className="card text-center py-8">
          <p className="text-gray-500">Generating insights...</p>
        </div>
      ) : insights && (
        <div className="card">
          <div className="flex items-center mb-4">
            <TrendingUp className="w-5 h-5 text-primary-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Trend</p>
              <p className="text-xl font-bold text-blue-700">{insights.trend}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Average Score</p>
              <p className="text-xl font-bold text-green-700">{insights.averageScore}%</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Recent Average</p>
              <p className="text-xl font-bold text-purple-700">{insights.recentAverage}%</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Strengths</h4>
              <ul className="space-y-1">
                {insights.strengths.map((strength, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    {strength}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Areas for Improvement</h4>
              <ul className="space-y-1">
                {insights.weaknesses.length > 0 ? (
                  insights.weaknesses.map((weakness, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-start">
                      <span className="text-orange-500 mr-2">!</span>
                      {weakness}
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-gray-500">No major concerns</li>
                )}
              </ul>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-semibold text-gray-900 mb-2">Recommendations</h4>
            <ul className="space-y-1">
              {insights.recommendations.map((rec, i) => (
                <li key={i} className="text-sm text-gray-700 flex items-start">
                  <span className="text-primary-500 mr-2">→</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {chartData.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {Object.keys(wordFrequency).length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Behavioral Keywords</h3>
          <div className="flex flex-wrap gap-3">
            {Object.entries(wordFrequency)
              .sort((a, b) => b[1] - a[1])
              .map(([word, count]) => (
                <span
                  key={word}
                  className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-gray-800 rounded-full font-medium"
                  style={{ fontSize: `${Math.min(14 + count * 2, 24)}px` }}
                >
                  {word} ({count})
                </span>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

const SectionView = ({ grade, section, students, testScores, insights, loadingInsights }) => {
  const studentScores = students.map(student => {
    const scores = testScores.filter(s => s.studentId === student.id)
    const avg = scores.length > 0 
      ? scores.reduce((sum, s) => sum + s.score, 0) / scores.length 
      : 0
    return {
      name: student.name,
      average: Math.round(avg * 10) / 10
    }
  }).filter(s => s.average > 0)

  const timeSeriesData = {}
  testScores.forEach(score => {
    const date = new Date(score.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    if (!timeSeriesData[date]) {
      timeSeriesData[date] = { date, scores: [] }
    }
    timeSeriesData[date].scores.push(score.score)
  })

  const classAverageData = Object.values(timeSeriesData).map(entry => ({
    date: entry.date,
    average: entry.scores.reduce((sum, s) => sum + s, 0) / entry.scores.length
  })).sort((a, b) => new Date(a.date) - new Date(b.date))

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {grade} - Section {section}
        </h2>
        <p className="text-gray-600">{students.length} students</p>
      </div>

      {loadingInsights ? (
        <div className="card text-center py-8">
          <p className="text-gray-500">Generating insights...</p>
        </div>
      ) : insights && (
        <div className="card">
          <div className="flex items-center mb-4">
            <Users className="w-5 h-5 text-primary-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Section Insights</h3>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-700">{insights.summary}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Class Average</p>
              <p className="text-xl font-bold text-green-700">{insights.classAverage}%</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total Students</p>
              <p className="text-xl font-bold text-purple-700">{insights.totalStudents}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Need Attention</p>
              <p className="text-xl font-bold text-orange-700">{insights.needsAttention.length}</p>
            </div>
          </div>

          {insights.topPerformers.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 mb-2">Top Performers</h4>
              <div className="flex flex-wrap gap-2">
                {insights.topPerformers.map((name, i) => (
                  <span key={i} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {insights.trends.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Trends</h4>
              <ul className="space-y-1">
                {insights.trends.map((trend, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start">
                    <span className="text-primary-500 mr-2">•</span>
                    {trend}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {classAverageData.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Class Average Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={classAverageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="average" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {studentScores.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Performance Comparison</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={studentScores}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="average" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

export default DataSynthesis
