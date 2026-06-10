import React, { useState } from 'react'
import { useData } from '../contexts/DataContext'
import { X } from 'lucide-react'

const TestScoreForm = ({ onClose, student, score }) => {
  const { addTestScore, updateTestScore } = useData()
  const [testName, setTestName] = useState(score?.testName || '')
  const [scoreValue, setScoreValue] = useState(score?.score || '')
  const [date, setDate] = useState(score?.date || new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const scoreData = {
        studentId: student.id,
        testName,
        score: parseFloat(scoreValue),
        date
      }

      if (score) {
        await updateTestScore(score.id, scoreData)
      } else {
        await addTestScore(scoreData)
      }

      onClose()
    } catch (error) {
      console.error('Error saving test score:', error)
      alert('Failed to save test score')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-slide-up">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {score ? 'Edit Test Score' : 'Add Test Score'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Student:</strong> {student.name}
            </p>
          </div>

          <div>
            <label className="label">Test Name</label>
            <input
              type="text"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              className="input-field"
              required
              placeholder="e.g., Unit Test 1, Mid-term"
            />
          </div>

          <div>
            <label className="label">Score (%)</label>
            <input
              type="number"
              value={scoreValue}
              onChange={(e) => setScoreValue(e.target.value)}
              className="input-field"
              required
              min="0"
              max="100"
              step="0.1"
              placeholder="0-100"
            />
          </div>

          <div>
            <label className="label">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary disabled:opacity-50"
            >
              {loading ? 'Saving...' : score ? 'Update' : 'Add Score'}
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

export default TestScoreForm
