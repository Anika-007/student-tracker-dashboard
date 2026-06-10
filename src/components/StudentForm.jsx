import React, { useState, useEffect } from 'react'
import { useData } from '../contexts/DataContext'
import { X } from 'lucide-react'

const StudentForm = ({ onClose, student }) => {
  const { addStudent, updateStudent, grades, sections } = useData()
  const [name, setName] = useState('')
  const [grade, setGrade] = useState('')
  const [section, setSection] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (student) {
      setName(student.name)
      setGrade(student.grade)
      setSection(student.section)
    }
  }, [student])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const studentData = { name, grade, section }
      
      if (student) {
        await updateStudent(student.id, studentData)
      } else {
        await addStudent(studentData)
      }
      
      onClose()
    } catch (error) {
      console.error('Error saving student:', error)
      alert('Failed to save student')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-slide-up">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {student ? 'Edit Student' : 'Add New Student'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="label">Student Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              required
              placeholder="Enter student name"
            />
          </div>

          <div>
            <label className="label">Grade</label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="input-field"
              required
            >
              <option value="">Select Grade</option>
              {grades.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Section</label>
            <select
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="input-field"
              required
            >
              <option value="">Select Section</option>
              {sections.map(s => (
                <option key={s} value={s}>Section {s}</option>
              ))}
            </select>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary disabled:opacity-50"
            >
              {loading ? 'Saving...' : student ? 'Update' : 'Add Student'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default StudentForm
