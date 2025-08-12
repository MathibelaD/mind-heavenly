import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '../../../../../lib/auth'
import { generateAIResponse } from '../../../../../lib/ai'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { message, conversationHistory } = await request.json()

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Get user context
    const { data: user } = await supabase
      .from('users')
      .select(`
        name,
        therapy_goals,
        clientSessions:therapy_sessions!client_id(
          id,
          title,
          created_at,
          ai_summary
        )
      `)
      .eq('id', session.user.id)
      .order('created_at', { foreignTable: 'therapy_sessions', ascending: false })
      .limit(5, { foreignTable: 'therapy_sessions' })
      .single()

    // Generate AI response
    const aiResponse = await generateAIResponse(
      message,
      conversationHistory || [],
      {
        name: user?.name || undefined,
        therapyGoals: user?.therapy_goals || undefined,
        recentSessions: user?.clientSessions || []
      }
    )

    // Create or find existing AI conversation
    const { data: existingConversations } = await supabase
      .from('ai_conversations')
      .select('*')
      .eq('user_id', session.user.id)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })
      .limit(1)

    let aiConversation = existingConversations?.[0]

    if (!aiConversation) {
      const { data: newConversation } = await supabase
        .from('ai_conversations')
        .insert({
          user_id: session.user.id,
          title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
          context: message,
          sentiment: aiResponse.sentiment.sentiment,
          crisis_level: aiResponse.sentiment.crisisLevel,
          model: 'gpt-4o-mini',
          is_escalated: aiResponse.shouldEscalate,
          escalated_at: aiResponse.shouldEscalate ? new Date().toISOString() : null,
          escalation_reason: aiResponse.escalationReason
        })
        .select()
        .single()
      
      aiConversation = newConversation
    } else {
      // Update existing conversation
      await supabase
        .from('ai_conversations')
        .update({
          sentiment: aiResponse.sentiment.sentiment,
          crisis_level: aiResponse.sentiment.crisisLevel,
          is_escalated: aiResponse.shouldEscalate || aiConversation.is_escalated,
          escalated_at: aiResponse.shouldEscalate && !aiConversation.escalated_at ? new Date().toISOString() : aiConversation.escalated_at,
          escalation_reason: aiResponse.escalationReason || aiConversation.escalation_reason,
          key_insights: [...(aiConversation.key_insights || []), ...aiResponse.sentiment.emotions],
          updated_at: new Date().toISOString()
        })
        .eq('id', aiConversation.id)
    }

    // Save user message
    await supabase
      .from('messages')
      .insert({
        content: message,
        sender_id: session.user.id,
        ai_conversation_id: aiConversation!.id,
        type: 'TEXT',
        is_encrypted: true
      })

    // Save AI response
    await supabase
      .from('messages')
      .insert({
        content: aiResponse.message,
        sender_id: session.user.id,
        ai_conversation_id: aiConversation!.id,
        type: 'TEXT',
        is_encrypted: true,
        metadata: {
          isAIResponse: true,
          sentiment: aiResponse.sentiment,
          suggestions: aiResponse.suggestions,
          crisisLevel: aiResponse.sentiment.crisisLevel
        }
      })

    // If escalation is needed, notify therapist (in production, implement email/SMS notifications)
    if (aiResponse.shouldEscalate) {
      console.log(`CRISIS ALERT: User ${session.user.id} needs immediate attention. Reason: ${aiResponse.escalationReason}`)
      
      // Log the crisis event
      await supabase
        .from('system_logs')
        .insert({
          level: 'critical',
          message: `Crisis escalation for user ${session.user.id}`,
          context: {
            userId: session.user.id,
            conversationId: aiConversation!.id,
            crisisLevel: aiResponse.sentiment.crisisLevel,
            reason: aiResponse.escalationReason,
            userMessage: message
          },
          user_id: session.user.id
        })
    }

    return NextResponse.json({
      message: aiResponse.message,
      sentiment: aiResponse.sentiment,
      shouldEscalate: aiResponse.shouldEscalate,
      escalationReason: aiResponse.escalationReason,
      suggestions: aiResponse.suggestions
    })

  } catch (error) {
    console.error('Error in AI chat API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get recent AI conversations for the user
    const conversations = await prisma.aIConversation.findMany({
      where: { userId: session.user.id },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { updatedAt: 'desc' },
      take: 10
    })

    return NextResponse.json({ conversations })

  } catch (error) {
    console.error('Error fetching AI conversations:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
