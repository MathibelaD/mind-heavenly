import OpenAI from 'openai'

export type CrisisLevel = 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface SentimentAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral' | 'anxious' | 'depressed'
  confidence: number
  crisisLevel: CrisisLevel
  keywords: string[]
  emotions: string[]
}

export interface AIResponse {
  message: string
  sentiment: SentimentAnalysis
  shouldEscalate: boolean
  escalationReason?: string
  suggestions: string[]
}

// Crisis keywords that trigger immediate escalation
const CRISIS_KEYWORDS = [
  'suicide', 'kill myself', 'end it all', 'not worth living', 'hurt myself',
  'self harm', 'cutting', 'overdose', 'jump off', 'hanging', 'pills',
  'want to die', 'better off dead', 'no point', 'give up', 'can\'t go on'
]

const HIGH_RISK_KEYWORDS = [
  'hopeless', 'worthless', 'trapped', 'burden', 'pain too much',
  'can\'t take it', 'desperate', 'exhausted', 'empty', 'numb'
]

const MEDIUM_RISK_KEYWORDS = [
  'depressed', 'anxious', 'overwhelmed', 'stressed', 'worried',
  'scared', 'angry', 'frustrated', 'confused', 'lost'
]

export function detectCrisisLevel(text: string): CrisisLevel {
  const lowerText = text.toLowerCase()
  
  // Check for critical crisis keywords
  for (const keyword of CRISIS_KEYWORDS) {
    if (lowerText.includes(keyword)) {
      return 'CRITICAL'
    }
  }
  
  // Check for high risk indicators
  let highRiskCount = 0
  for (const keyword of HIGH_RISK_KEYWORDS) {
    if (lowerText.includes(keyword)) {
      highRiskCount++
    }
  }
  
  if (highRiskCount >= 2) {
    return 'HIGH'
  } else if (highRiskCount >= 1) {
    return 'MEDIUM'
  }
  
  // Check for medium risk indicators
  let mediumRiskCount = 0
  for (const keyword of MEDIUM_RISK_KEYWORDS) {
    if (lowerText.includes(keyword)) {
      mediumRiskCount++
    }
  }
  
  if (mediumRiskCount >= 3) {
    return 'MEDIUM'
  } else if (mediumRiskCount >= 1) {
    return 'LOW'
  }
  
  return 'NONE'
}

export async function analyzeSentiment(text: string): Promise<SentimentAnalysis> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a mental health sentiment analysis system. Analyze the emotional content of the message and respond with a JSON object containing:
          - sentiment: one of 'positive', 'negative', 'neutral', 'anxious', 'depressed'
          - confidence: number between 0-1
          - emotions: array of detected emotions
          - keywords: array of significant emotional keywords found
          
          Focus on mental health context and be sensitive to crisis indicators.`
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.3
    })

    const result = JSON.parse(response.choices[0].message.content || '{}')
    const crisisLevel = detectCrisisLevel(text)
    
    return {
      sentiment: result.sentiment || 'neutral',
      confidence: result.confidence || 0.5,
      crisisLevel,
      keywords: result.keywords || [],
      emotions: result.emotions || []
    }
  } catch (error) {
    console.error('Error analyzing sentiment:', error)
    // Fallback analysis
    const crisisLevel = detectCrisisLevel(text)
    return {
      sentiment: 'neutral',
      confidence: 0.5,
      crisisLevel,
      keywords: [],
      emotions: []
    }
  }
}

export async function generateAIResponse(
  userMessage: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>,
  userContext?: {
    name?: string
    therapyGoals?: string
    recentSessions?: any[]
  }
): Promise<AIResponse> {
  try {
    // Analyze sentiment first
    const sentiment = await analyzeSentiment(userMessage)
    
    // Determine if escalation is needed
    const shouldEscalate = sentiment.crisisLevel === CrisisLevel.CRITICAL || 
                          sentiment.crisisLevel === CrisisLevel.HIGH
    
    let escalationReason: string | undefined
    if (shouldEscalate) {
      escalationReason = sentiment.crisisLevel === CrisisLevel.CRITICAL 
        ? 'Crisis keywords detected indicating immediate risk'
        : 'High risk emotional state detected'
    }

    // Build system prompt
    const systemPrompt = `You are a compassionate AI therapy assistant for Mind Heavenly platform. Your role is to provide supportive, empathetic responses while maintaining professional boundaries.

Key guidelines:
- Be warm, empathetic, and non-judgmental
- Ask open-ended questions to encourage reflection
- Provide coping strategies and grounding techniques when appropriate
- Never diagnose or provide medical advice
- Encourage professional help when needed
- If crisis indicators are present, acknowledge their feelings but emphasize professional support

${userContext?.name ? `User's name: ${userContext.name}` : ''}
${userContext?.therapyGoals ? `Their therapy goals: ${userContext.therapyGoals}` : ''}

Current sentiment analysis: ${sentiment.sentiment} (${sentiment.confidence * 100}% confidence)
Crisis level: ${sentiment.crisisLevel}
Detected emotions: ${sentiment.emotions.join(', ')}

${shouldEscalate ? 'IMPORTANT: This conversation shows crisis indicators and should be escalated to a human therapist immediately.' : ''}

Respond with compassion and provide 2-3 helpful suggestions at the end.`

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...conversationHistory.slice(-10), // Keep last 10 messages for context
        { role: "user", content: userMessage }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })

    const aiMessage = response.choices[0].message.content || 
      "I'm here to listen and support you. How are you feeling right now?"

    // Extract suggestions from the response (simple heuristic)
    const suggestions: string[] = []
    if (sentiment.sentiment === 'anxious') {
      suggestions.push(
        "Try deep breathing: inhale for 4 counts, hold for 4, exhale for 6",
        "Consider grounding techniques: name 5 things you can see",
        "Take a short walk or gentle movement"
      )
    } else if (sentiment.sentiment === 'depressed') {
      suggestions.push(
        "Reach out to a trusted friend or family member",
        "Engage in a small, achievable activity",
        "Consider your self-care routine"
      )
    } else if (sentiment.crisisLevel !== CrisisLevel.NONE) {
      suggestions.push(
        "Contact your therapist or crisis hotline immediately",
        "Reach out to a trusted friend or family member",
        "Consider calling emergency services if you're in immediate danger"
      )
    } else {
      suggestions.push(
        "Take some time for self-reflection",
        "Practice mindfulness or meditation",
        "Journal about your thoughts and feelings"
      )
    }

    return {
      message: aiMessage,
      sentiment,
      shouldEscalate,
      escalationReason,
      suggestions
    }
  } catch (error) {
    console.error('Error generating AI response:', error)
    
    // Fallback response
    const sentiment = await analyzeSentiment(userMessage)
    return {
      message: "I'm here to listen and support you. Sometimes technology has hiccups, but your feelings and experiences are always valid. How can I help you today?",
      sentiment,
      shouldEscalate: sentiment.crisisLevel === CrisisLevel.CRITICAL,
      escalationReason: sentiment.crisisLevel === CrisisLevel.CRITICAL ? 'Crisis indicators detected' : undefined,
      suggestions: [
        "Take a moment to breathe deeply",
        "Consider reaching out to your support network",
        "Remember that it's okay to ask for help"
      ]
    }
  }
}

export async function generateSessionSummary(
  sessionNotes: string,
  participantNames: string[],
  sessionType: 'INDIVIDUAL' | 'COUPLE' | 'GROUP'
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant helping therapists generate session summaries. Create a professional, concise summary that includes:
          
          1. Key topics discussed
          2. Notable insights or breakthroughs
          3. Emotional patterns observed
          4. Progress toward therapy goals
          5. Recommended follow-up actions
          
          Keep the summary confidential, professional, and focused on therapeutic progress.
          Session type: ${sessionType}
          Participants: ${participantNames.join(', ')}`
        },
        {
          role: "user",
          content: `Session notes: ${sessionNotes}`
        }
      ],
      temperature: 0.5,
      max_tokens: 800
    })

    return response.choices[0].message.content || 'Session summary could not be generated.'
  } catch (error) {
    console.error('Error generating session summary:', error)
    return 'Session summary could not be generated due to technical issues.'
  }
}

export async function generatePersonalizedContent(
  userProfile: {
    therapyGoals?: string
    recentMoods?: string[]
    completedContent?: string[]
    preferences?: string[]
  }
): Promise<{
  recommendations: Array<{
    title: string
    type: 'article' | 'meditation' | 'exercise'
    description: string
    reason: string
  }>
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an AI content curator for a therapy platform. Based on the user's profile, recommend 3-5 pieces of content that would be most helpful for their current state and goals.

          Respond with a JSON object containing a "recommendations" array with objects having:
          - title: engaging title for the content
          - type: "article", "meditation", or "exercise"
          - description: brief description of the content
          - reason: why this is recommended for this specific user
          
          Focus on evidence-based therapeutic approaches and practical tools.`
        },
        {
          role: "user",
          content: `User profile:
          Therapy goals: ${userProfile.therapyGoals || 'Not specified'}
          Recent moods: ${userProfile.recentMoods?.join(', ') || 'Not tracked'}
          Completed content: ${userProfile.completedContent?.join(', ') || 'None'}
          Preferences: ${userProfile.preferences?.join(', ') || 'Not specified'}`
        }
      ],
      temperature: 0.7
    })

    const result = JSON.parse(response.choices[0].message.content || '{"recommendations": []}')
    return result
  } catch (error) {
    console.error('Error generating personalized content:', error)
    return {
      recommendations: [
        {
          title: "Daily Mindfulness Practice",
          type: "meditation",
          description: "A simple 5-minute mindfulness exercise to start your day with clarity and calm.",
          reason: "Mindfulness is beneficial for overall mental wellness and emotional regulation."
        }
      ]
    }
  }
}
