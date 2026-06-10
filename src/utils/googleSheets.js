export const exportToGoogleSheets = async (data, auth) => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  
  if (!clientId || clientId === 'your_google_client_id_here') {
    alert('Google Sheets integration requires a valid Google Client ID. Please configure it in your .env file.')
    return
  }

  try {
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'https://www.googleapis.com/auth/spreadsheets',
      callback: async (response) => {
        if (response.error) {
          console.error('Auth error:', response)
          return
        }

        await createAndPopulateSheet(response.access_token, data)
      }
    })

    tokenClient.requestAccessToken()
  } catch (error) {
    console.error('Google Sheets export error:', error)
    alert('Failed to export to Google Sheets. Please check console for details.')
  }
}

const createAndPopulateSheet = async (accessToken, data) => {
  try {
    const createResponse = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        properties: {
          title: `Student Tracker - ${new Date().toLocaleDateString()}`
        },
        sheets: [
          { properties: { title: 'Students' } },
          { properties: { title: 'Test Scores' } },
          { properties: { title: 'Behavioral Data' } }
        ]
      })
    })

    const spreadsheet = await createResponse.json()
    const spreadsheetId = spreadsheet.spreadsheetId

    const studentRows = [
      ['Student ID', 'Name', 'Grade', 'Section'],
      ...data.students.map(s => [s.id, s.name, s.grade, s.section])
    ]

    const testScoreRows = [
      ['Student ID', 'Student Name', 'Test Name', 'Score', 'Date'],
      ...data.testScores.map(t => [
        t.studentId,
        data.students.find(s => s.id === t.studentId)?.name || '',
        t.testName,
        t.score,
        new Date(t.date).toLocaleDateString()
      ])
    ]

    const behavioralRows = [
      ['Student ID', 'Student Name', 'Self Words', 'Peer Words', 'Date'],
      ...data.behavioralData.map(b => [
        b.studentId,
        data.students.find(s => s.id === b.studentId)?.name || '',
        (b.selfWords || []).join(', '),
        (b.peerWords || []).join(', '),
        new Date(b.date).toLocaleDateString()
      ])
    ]

    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        valueInputOption: 'RAW',
        data: [
          { range: 'Students!A1', values: studentRows },
          { range: 'Test Scores!A1', values: testScoreRows },
          { range: 'Behavioral Data!A1', values: behavioralRows }
        ]
      })
    })

    window.open(`https://docs.google.com/spreadsheets/d/${spreadsheetId}`, '_blank')
    alert('Data exported successfully to Google Sheets!')
  } catch (error) {
    console.error('Error creating sheet:', error)
    alert('Failed to create Google Sheet. Please try again.')
  }
}

export const loadGoogleSheetsAPI = () => {
  return new Promise((resolve, reject) => {
    if (window.google) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}
