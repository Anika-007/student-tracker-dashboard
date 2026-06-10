import React, { useState } from 'react'
import { useData } from '../contexts/DataContext'
import { X } from 'lucide-react'

const CustomCategoryForm = ({ onClose, student, category }) => {
  const { addCustomCategoryEntry } = useData()
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (fieldLabel, value) => {
    setFormData({ ...formData, [fieldLabel]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await addCustomCategoryEntry(category.id, student.id, formData)
      onClose()
    } catch (error) {
      console.error('Error saving custom category data:', error)
      alert('Failed to save data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-slide-up">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Add {category.name}
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

          {category.fields.map((field, index) => (
            <div key={index}>
              <label className="label">{field.label}</label>
              {field.type === 'number' ? (
                <input
                  type="number"
                  onChange={(e) => handleChange(field.label, e.target.value)}
                  className="input-field"
                  required
                  step="any"
                />
              ) : field.type === 'date' ? (
                <input
                  type="date"
                  onChange={(e) => handleChange(field.label, e.target.value)}
                  className="input-field"
                  required
                />
              ) : (
                <input
                  type="text"
                  onChange={(e) => handleChange(field.label, e.target.value)}
                  className="input-field"
                  required
                />
              )}
            </div>
          ))}

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Add Entry'}
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

export default CustomCategoryForm
