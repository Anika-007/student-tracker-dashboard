import React, { useState } from 'react'
import { useData } from '../contexts/DataContext'
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react'
import StudentForm from '../components/StudentForm'
import TestScoreForm from '../components/TestScoreForm'
import BehavioralForm from '../components/BehavioralForm'
import CustomCategoryForm from '../components/CustomCategoryForm'

const Dashboard = () => {
  const { 
    students, 
    grades, 
    sections,
    deleteStudent,
    deleteTestScore,
    deleteBehavioralData,
    getTestScoresByStudent,
    getBehavioralDataByStudent
  } = useData()

  const [selectedGrade, setSelectedGrade] = useState('')
  const [selectedSection, setSelectedSection] = useState('')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showStudentForm, setShowStudentForm] = useState(false)
  const [showTestForm, setShowTestForm] = useState(false)
  const [showBehavioralForm, setShowBehavioralForm] = useState(false)
  const [showCustomCategoryForm, setShowCustomCategoryForm] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [editingStudent, setEditingStudent] = useState(null)

  const filteredStudents = students.filter(s => 
    (!selectedGrade || s.grade === selectedGrade) &&
    (!selectedSection || s.section === selectedSection)
  )

  const handleSelectStudent = (student) => {
    setSelectedStudent(student)
  }

  const handleDeleteStudent = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student? All associated data will be removed.')) {
      await deleteStudent(studentId)
      if (selectedStudent?.id === studentId) {
        setSelectedStudent(null)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
        <button
          onClick={() => setShowStudentForm(true)}
          className="btn-primary inline-flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Student
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter Students</h2>
            
            <div className="space-y-3">
              <div>
                <label className="label">Grade</label>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="input-field"
                >
                  <option value="">All Grades</option>
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
                  <option value="">All Sections</option>
                  {sections.map(section => (
                    <option key={section} value={section}>Section {section}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Students ({filteredStudents.length})
            </h2>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredStudents.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No students found. Add a student to get started.
                </p>
              ) : (
                filteredStudents.map(student => (
                  <div
                    key={student.id}
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                      selectedStudent?.id === student.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => handleSelectStudent(student)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-500">
                          {student.grade} - Section {student.section}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteStudent(student.id)
                        }}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedStudent ? (
            <StudentDetails
              student={selectedStudent}
              onAddTestScore={() => setShowTestForm(true)}
              onAddBehavioral={() => setShowBehavioralForm(true)}
              onAddCustomCategory={(category) => {
                setSelectedCategory(category)
                setShowCustomCategoryForm(true)
              }}
              getTestScores={getTestScoresByStudent}
              getBehavioralData={getBehavioralDataByStudent}
              deleteTestScore={deleteTestScore}
              deleteBehavioralData={deleteBehavioralData}
            />
          ) : (
            <div className="card text-center py-12">
              <p className="text-gray-500">Select a student to view and manage their data</p>
            </div>
          )}
        </div>
      </div>

      {showStudentForm && (
        <StudentForm
          onClose={() => setShowStudentForm(false)}
          student={editingStudent}
        />
      )}

      {showTestForm && selectedStudent && (
        <TestScoreForm
          onClose={() => setShowTestForm(false)}
          student={selectedStudent}
        />
      )}

      {showBehavioralForm && selectedStudent && (
        <BehavioralForm
          onClose={() => setShowBehavioralForm(false)}
          student={selectedStudent}
        />
      )}

      {showCustomCategoryForm && selectedStudent && selectedCategory && (
        <CustomCategoryForm
          onClose={() => {
            setShowCustomCategoryForm(false)
            setSelectedCategory(null)
          }}
          student={selectedStudent}
          category={selectedCategory}
        />
      )}
    </div>
  )
}

const StudentDetails = ({ 
  student, 
  onAddTestScore, 
  onAddBehavioral,
  onAddCustomCategory,
  getTestScores,
  getBehavioralData,
  deleteTestScore,
  deleteBehavioralData
}) => {
  const { customCategories, getCustomCategoryData } = useData()
  const testScores = getTestScores(student.id)
  const behavioralData = getBehavioralData(student.id)

  const handleDeleteScore = async (scoreId) => {
    if (window.confirm('Delete this test score?')) {
      await deleteTestScore(scoreId)
    }
  }

  const handleDeleteBehavioral = async (entryId) => {
    if (window.confirm('Delete this behavioral entry?')) {
      await deleteBehavioralData(entryId)
    }
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{student.name}</h2>
        <p className="text-gray-600">{student.grade} - Section {student.section}</p>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Test Scores</h3>
          <button onClick={onAddTestScore} className="btn-primary text-sm inline-flex items-center">
            <Plus className="w-4 h-4 mr-1" />
            Add Score
          </button>
        </div>

        <div className="space-y-2">
          {testScores.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No test scores recorded</p>
          ) : (
            testScores
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map(score => (
                <div key={score.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{score.testName}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(score.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-bold text-primary-600">{score.score}%</span>
                    <button
                      onClick={() => handleDeleteScore(score.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Behavioral Data</h3>
          <button onClick={onAddBehavioral} className="btn-primary text-sm inline-flex items-center">
            <Plus className="w-4 h-4 mr-1" />
            Add Entry
          </button>
        </div>

        <div className="space-y-3">
          {behavioralData.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No behavioral data recorded</p>
          ) : (
            behavioralData
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map(entry => (
                <div key={entry.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm text-gray-500">
                      {new Date(entry.date).toLocaleDateString()}
                    </p>
                    <button
                      onClick={() => handleDeleteBehavioral(entry.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">Self-Description:</p>
                      <div className="flex flex-wrap gap-2">
                        {(entry.selfWords || []).map((word, i) => (
                          <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {word}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">Peer Description:</p>
                      <div className="flex flex-wrap gap-2">
                        {(entry.peerWords || []).map((word, i) => (
                          <span key={i} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            {word}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>

      {/* Custom Categories */}
      {customCategories.map((category) => {
        const categoryData = getCustomCategoryData(category.id, student.id)
        return (
          <div key={category.id} className="card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
              <button 
                onClick={() => onAddCustomCategory(category)} 
                className="btn-primary text-sm inline-flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Entry
              </button>
            </div>

            <div className="space-y-2">
              {categoryData.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No {category.name.toLowerCase()} data recorded</p>
              ) : (
                categoryData
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map(entry => (
                    <div key={entry.id} className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-sm text-gray-500">
                          {new Date(entry.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(entry.data).map(([key, value]) => (
                          <div key={key} className="text-sm">
                            <span className="font-medium text-gray-700">{key}:</span>{' '}
                            <span className="text-gray-900">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Dashboard
