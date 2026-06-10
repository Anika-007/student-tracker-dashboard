import React, { useState } from 'react'
import { useData } from '../contexts/DataContext'
import { X, Plus, Trash2 } from 'lucide-react'

const BehavioralForm = ({ onClose, student, entry }) => {
  const { addBehavioralData, updateBehavioralData } = useData()
  const [selfWords, setSelfWords] = useState(entry?.selfWords || [])
  const [peerWords, setPeerWords] = useState(entry?.peerWords || [])
  const [selfInput, setSelfInput] = useState('')
  const [peerInput, setPeerInput] = useState('')
  const [date, setDate] = useState(entry?.date || new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)

  const addSelfWord = () => {
    if (selfInput.trim() && selfWords.length < 4) {
      setSelfWords([...selfWords, selfInput.trim()])
      setSelfInput('')
    }
  }

  const addPeerWord = () => {
    if (peerInput.trim() && peerWords.length < 4) {
      setPeerWords([...peerWords, peerInput.trim()])
      setPeerInput('')
    }
  }

  const removeSelfWord = (index) => {
    setSelfWords(selfWords.filter((_, i) => i !== index))
  }

  const removePeerWord = (index) => {
    setPeerWords(peerWords.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (selfWords.length === 0 && peerWords.length === 0) {
      alert('Please add at least one word')
      return
    }

    setLoading(true)

    try {
      const behavioralEntry = {
        studentId: student.id,
        selfWords,
        peerWords,
        date
      }

      if (entry) {
        await updateBehavioralData(entry.id, behavioralEntry)
      } else {
        await addBehavioralData(behavioralEntry)
      }

      onClose()
    } catch (error) {
      console.error('Error saving behavioral data:', error)
      alert('Failed to save behavioral data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-slide-up">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {entry ? 'Edit Behavioral Data' : 'Add Behavioral Data'}
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
            <label className="label">Self-Description (2-4 words)</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={selfInput}
                onChange={(e) => setSelfInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSelfWord())}
                className="input-field"
                placeholder="Enter a word"
                disabled={selfWords.length >= 4}
              />
              <button
                type="button"
                onClick={addSelfWord}
                disabled={selfWords.length >= 4 || !selfInput.trim()}
                className="btn-primary disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {selfWords.map((word, i) => (
                <span key={i} className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {word}
                  <button
                    type="button"
                    onClick={() => removeSelfWord(i)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Peer Description (2-4 words)</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={peerInput}
                onChange={(e) => setPeerInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPeerWord())}
                className="input-field"
                placeholder="Enter a word"
                disabled={peerWords.length >= 4}
              />
              <button
                type="button"
                onClick={addPeerWord}
                disabled={peerWords.length >= 4 || !peerInput.trim()}
                className="btn-primary disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {peerWords.map((word, i) => (
                <span key={i} className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                  {word}
                  <button
                    type="button"
                    onClick={() => removePeerWord(i)}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
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
              {loading ? 'Saving...' : entry ? 'Update' : 'Add Entry'}
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

export default BehavioralForm
