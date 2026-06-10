export const generateStudentInsights = async (studentData, testScores, behaviouralData) => {
  const scores = testScores.sort((a, b) => new Date(a.date) - new Date(b.date))
  
  if (scores.length === 0) {
    return {
      trend: 'No data available',
      strengths: [],
      weaknesses: [],
      recommendations: ['Add test scores to generate insights']
    }
  }

  const avgScore = scores.reduce((sum, s) => sum + s.score, 0) / scores.length
  const recentScores = scores.slice(-3)
  const recentAvg = recentScores.reduce((sum, s) => sum + s.score, 0) / recentScores.length
  
  let trend = 'Stable'
  if (scores.length >= 2) {
    const firstHalf = scores.slice(0, Math.ceil(scores.length / 2))
    const secondHalf = scores.slice(Math.ceil(scores.length / 2))
    const firstAvg = firstHalf.reduce((sum, s) => sum + s.score, 0) / firstHalf.length
    const secondAvg = secondHalf.reduce((sum, s) => sum + s.score, 0) / secondHalf.length
    
    if (secondAvg > firstAvg + 5) trend = 'Improving'
    else if (secondAvg < firstAvg - 5) trend = 'Declining'
  }

  const strengths = []
  const weaknesses = []
  const recommendations = []

  if (avgScore >= 80) {
    strengths.push('Consistently high performance')
    strengths.push('Strong grasp of concepts')
  } else if (avgScore >= 60) {
    strengths.push('Moderate understanding of material')
  } else {
    weaknesses.push('Needs improvement in core concepts')
  }

  if (trend === 'Improving') {
    strengths.push('Showing positive progress over time')
    recommendations.push('Continue current study methods')
  } else if (trend === 'Declining') {
    weaknesses.push('Recent performance decline')
    recommendations.push('Schedule one-on-one session to identify challenges')
    recommendations.push('Review recent topics for gaps in understanding')
  }

  const variance = scores.reduce((sum, s) => sum + Math.pow(s.score - avgScore, 2), 0) / scores.length
  if (variance > 200) {
    weaknesses.push('Inconsistent performance')
    recommendations.push('Focus on building consistent study habits')
  } else {
    strengths.push('Consistent performance')
  }

  if (behaviouralData && behaviouralData.length > 0) {
    const allWords = behaviouralData.flatMap(b => [...(b.selfWords || []), ...(b.peerWords || [])])
    const positiveWords = ['confident', 'helpful', 'focused', 'engaged', 'motivated', 'active', 'curious']
    const concernWords = ['distracted', 'quiet', 'withdrawn', 'unmotivated', 'confused', 'struggling']
    
    const hasPositive = allWords.some(w => positiveWords.some(p => w.toLowerCase().includes(p)))
    const hasConcern = allWords.some(w => concernWords.some(c => w.toLowerCase().includes(c)))
    
    if (hasPositive) {
      strengths.push('Positive behavioral indicators')
    }
    if (hasConcern) {
      weaknesses.push('Some behavioral concerns noted')
      recommendations.push('Monitor engagement and provide additional support')
    }
  }

  if (recommendations.length === 0) {
    recommendations.push('Continue monitoring progress')
  }

  return {
    trend,
    averageScore: Math.round(avgScore * 10) / 10,
    recentAverage: Math.round(recentAvg * 10) / 10,
    strengths,
    weaknesses,
    recommendations
  }
}

export const generateSectionInsights = async (sectionData, allStudents) => {
  if (!allStudents || allStudents.length === 0) {
    return {
      summary: 'No student data available for this section',
      classAverage: 0,
      topPerformers: [],
      needsAttention: [],
      trends: []
    }
  }

  const studentScores = allStudents.map(student => {
    const scores = sectionData.testScores?.filter(s => s.studentId === student.id) || []
    const avg = scores.length > 0 
      ? scores.reduce((sum, s) => sum + s.score, 0) / scores.length 
      : 0
    return { ...student, avgScore: avg, scoreCount: scores.length }
  }).filter(s => s.scoreCount > 0)

  const classAverage = studentScores.length > 0
    ? studentScores.reduce((sum, s) => sum + s.avgScore, 0) / studentScores.length
    : 0

  const topPerformers = studentScores
    .sort((a, b) => b.avgScore - a.avgScore)
    .slice(0, 3)
    .map(s => s.name)

  const needsAttention = studentScores
    .filter(s => s.avgScore < 60)
    .map(s => s.name)

  const trends = []
  if (classAverage >= 75) {
    trends.push('Class is performing well overall')
  } else if (classAverage >= 60) {
    trends.push('Class showing moderate performance')
  } else {
    trends.push('Class may need additional support')
  }

  if (needsAttention.length > studentScores.length * 0.3) {
    trends.push('Significant portion of class needs attention')
  }

  const summary = `The section has an average score of ${Math.round(classAverage)}%. ${
    topPerformers.length > 0 ? `Top performers include ${topPerformers.join(', ')}.` : ''
  } ${needsAttention.length > 0 ? `${needsAttention.length} student(s) may need additional support.` : 'All students are performing adequately.'}`

  return {
    summary,
    classAverage: Math.round(classAverage * 10) / 10,
    topPerformers,
    needsAttention,
    trends,
    totalStudents: studentScores.length
  }
}

export const generateAIInsightWithAPI = async (prompt) => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY
  
  if (!apiKey || apiKey === 'your_openai_api_key_here') {
    return null
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an educational analyst helping teachers understand student performance. Provide concise, actionable insights.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 200,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      throw new Error('API request failed')
    }

    const data = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    console.error('AI API Error:', error)
    return null
  }
}
