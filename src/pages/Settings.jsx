import React, { useState } from 'react'
import { useData } from '../contexts/DataContext'
import { Plus, Trash2, Edit2, Save, X, Settings as SettingsIcon } from 'lucide-react'

const Settings = () => {
  const { 
    grades, 
    sections, 
    customCategories,
    updateGrades, 
    updateSections,
    addCustomCategory,
    updateCustomCategory,
    deleteCustomCategory
  } = useData()

  const [newGrade, setNewGrade] = useState('')
  const [newSection, setNewSection] = useState('')
  const [editingGrades, setEditingGrades] = useState(false)
  const [editingSections, setEditingSections] = useState(false)
  const [tempGrades, setTempGrades] = useState([...grades])
  const [tempSections, setTempSections] = useState([...sections])
  const [showCategoryForm, setShowCategoryForm] = useState(false)

  const handleSaveGrades = () => {
    updateGrades(tempGrades)
    setEditingGrades(false)
  }

  const handleSaveSections = () => {
    updateSections(tempSections)
    setEditingSections(false)
  }

  const handleAddGrade = () => {
    if (newGrade.trim()) {
      setTempGrades([...tempGrades, newGrade.trim()])
      setNewGrade('')
    }
  }

  const handleAddSection = () => {
    if (newSection.trim()) {
      setTempSections([...tempSections, newSection.trim()])
      setNewSection('')
    }
  }

  const handleRemoveGrade = (index) => {
    setTempGrades(tempGrades.filter((_, i) => i !== index))
  }

  const handleRemoveSection = (index) => {
    setTempSections(tempSections.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <SettingsIcon className="w-8 h-8 text-primary-600" />
        <h1 className="text-3xl font-bold text-gray-900">Settings & Customization</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grades Management */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Manage Grades</h2>
            {!editingGrades ? (
              <button
                onClick={() => {
                  setEditingGrades(true)
                  setTempGrades([...grades])
                }}
                className="btn-secondary text-sm inline-flex items-center"
              >
                <Edit2 className="w-4 h-4 mr-1" />
                Edit
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveGrades}
                  className="btn-primary text-sm inline-flex items-center"
                >
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingGrades(false)
                    setTempGrades([...grades])
                  }}
                  className="btn-secondary text-sm"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {editingGrades ? (
            <div className="space-y-3">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newGrade}
                  onChange={(e) => setNewGrade(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddGrade()}
                  placeholder="e.g., Grade 11"
                  className="input-field"
                />
                <button onClick={handleAddGrade} className="btn-primary">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                {tempGrades.map((grade, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">{grade}</span>
                    <button
                      onClick={() => handleRemoveGrade(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {grades.map((grade, index) => (
                <span key={index} className="px-4 py-2 bg-primary-100 text-primary-800 rounded-full font-medium">
                  {grade}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Sections Management */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Manage Sections</h2>
            {!editingSections ? (
              <button
                onClick={() => {
                  setEditingSections(true)
                  setTempSections([...sections])
                }}
                className="btn-secondary text-sm inline-flex items-center"
              >
                <Edit2 className="w-4 h-4 mr-1" />
                Edit
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveSections}
                  className="btn-primary text-sm inline-flex items-center"
                >
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingSections(false)
                    setTempSections([...sections])
                  }}
                  className="btn-secondary text-sm"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {editingSections ? (
            <div className="space-y-3">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newSection}
                  onChange={(e) => setNewSection(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSection()}
                  placeholder="e.g., F"
                  className="input-field"
                />
                <button onClick={handleAddSection} className="btn-primary">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                {tempSections.map((section, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">Section {section}</span>
                    <button
                      onClick={() => handleRemoveSection(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {sections.map((section, index) => (
                <span key={index} className="px-4 py-2 bg-green-100 text-green-800 rounded-full font-medium">
                  Section {section}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Custom Categories */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Custom Data Categories</h2>
            <p className="text-sm text-gray-600 mt-1">
              Add your own categories beyond test scores and behavioral data
            </p>
          </div>
          <button
            onClick={() => setShowCategoryForm(true)}
            className="btn-primary inline-flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Default Categories */}
          <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-blue-900">Test Scores</h3>
              <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">Default</span>
            </div>
            <p className="text-sm text-blue-700">Academic performance tracking</p>
          </div>

          <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-green-900">Behavioral Data</h3>
              <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">Default</span>
            </div>
            <p className="text-sm text-green-700">Self and peer descriptions</p>
          </div>

          {/* Custom Categories */}
          {customCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onUpdate={updateCustomCategory}
              onDelete={deleteCustomCategory}
            />
          ))}
        </div>
      </div>

      {showCategoryForm && (
        <CategoryForm
          onClose={() => setShowCategoryForm(false)}
          onSave={addCustomCategory}
        />
      )}
    </div>
  )
}

const CategoryCard = ({ category, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(category.name)
  const [description, setDescription] = useState(category.description)

  const handleSave = () => {
    onUpdate(category.id, { name, description, fields: category.fields })
    setIsEditing(false)
  }

  return (
    <div className="p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
      {isEditing ? (
        <div className="space-y-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field text-sm"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field text-sm"
            placeholder="Description"
          />
          <div className="flex space-x-2">
            <button onClick={handleSave} className="btn-primary text-xs">
              <Save className="w-3 h-3 mr-1" />
              Save
            </button>
            <button onClick={() => setIsEditing(false)} className="btn-secondary text-xs">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-purple-900">{category.name}</h3>
            <div className="flex space-x-1">
              <button
                onClick={() => setIsEditing(true)}
                className="text-purple-600 hover:text-purple-800"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Delete this category?')) {
                    onDelete(category.id)
                  }
                }}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="text-sm text-purple-700">{category.description}</p>
          <div className="mt-2 text-xs text-purple-600">
            Fields: {category.fields.map(f => f.label).join(', ')}
          </div>
        </>
      )}
    </div>
  )
}

const CategoryForm = ({ onClose, onSave }) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [fields, setFields] = useState([])
  const [newFieldLabel, setNewFieldLabel] = useState('')
  const [newFieldType, setNewFieldType] = useState('text')

  const addField = () => {
    if (newFieldLabel.trim()) {
      setFields([...fields, { label: newFieldLabel.trim(), type: newFieldType }])
      setNewFieldLabel('')
    }
  }

  const removeField = (index) => {
    setFields(fields.filter((_, i) => i !== index))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name.trim() && fields.length > 0) {
      onSave({ name, description, fields })
      onClose()
    } else {
      alert('Please add a category name and at least one field')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 animate-slide-up max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create Custom Category</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="label">Category Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="e.g., Attendance, Projects, Homework"
              required
            />
          </div>

          <div>
            <label className="label">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field"
              placeholder="Brief description of this category"
            />
          </div>

          <div>
            <label className="label">Fields to Track</label>
            <div className="flex space-x-2 mb-3">
              <input
                type="text"
                value={newFieldLabel}
                onChange={(e) => setNewFieldLabel(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addField())}
                className="input-field flex-1"
                placeholder="Field name (e.g., Days Present, Grade)"
              />
              <select
                value={newFieldType}
                onChange={(e) => setNewFieldType(e.target.value)}
                className="input-field w-32"
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="date">Date</option>
              </select>
              <button type="button" onClick={addField} className="btn-primary">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {fields.map((field, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium text-gray-900">{field.label}</span>
                    <span className="text-sm text-gray-500 ml-2">({field.type})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeField(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button type="submit" className="flex-1 btn-primary">
              Create Category
            </button>
            <button type="button" onClick={onClose} className="flex-1 btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Settings
