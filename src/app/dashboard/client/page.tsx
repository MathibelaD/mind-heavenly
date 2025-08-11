'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Calendar,
  MessageCircle,
  Brain,
  Heart,
  BookOpen,
  TrendingUp,
  Clock,
  Video,
  Play,
  ChevronRight,
  Target,
  Zap
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card'
import { Button } from '../../../../components/ui/button'
import { Avatar, AvatarFallback } from '../../../../components/ui/avatar'
import { useAuth } from '../../../../lib/hooks/useAuth'

export default function ClientDashboard() {
  const { user, loading, supabase } = useAuth()
  
  // Check if user is a client
  const isClient = user?.role === 'CLIENT'

  // States
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([])
  const [recentAIChats, setRecentAIChats] = useState<any[]>([])
  const [recommendedContent, setRecommendedContent] = useState<any[]>([])
  const [dataLoading, setDataLoading] = useState(true)

  // Example static mood data
  const moodData = [
    { day: 'Mon', mood: 8 },
    { day: 'Tue', mood: 6 },
    { day: 'Wed', mood: 7 },
    { day: 'Thu', mood: 9 },
    { day: 'Fri', mood: 8 },
    { day: 'Sat', mood: 7 },
    { day: 'Sun', mood: 8 },
  ]
  const weeklyMoodAverage = Math.round(
    moodData.reduce((sum, day) => sum + day.mood, 0) / moodData.length
  )

  // Fetch data
  useEffect(() => {
    async function fetchClientData() {
      if (!user?.id || !isClient) return

      try {
        setDataLoading(true)

        // Fetch upcoming sessions for this client
        const { data: sessionsData, error: sessionsError } = await supabase
          .from('therapy_sessions')
          .select(`
            id,
            session_date,
            session_time,
            status,
            session_type,
            therapist:users!sessions_therapist_id_fkey(
              id,
              name,
              first_name,
              last_name
            )
          `)
          .eq('client_id', user.id)
          .gte('session_date', new Date().toISOString().split('T')[0]) // today or later
          .order('session_date', { ascending: true })
          .limit(5)

        if (sessionsError) {
          console.error('Error fetching sessions:', sessionsError)
        } else {
          setUpcomingSessions(sessionsData || [])
        }

        // Fetch AI conversations
        const { data: aiData, error: aiError } = await supabase
          .from('ai_conversations')
          .select(`
            id,
            topic,
            last_message,
            updated_at,
            sentiment
          `)
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(5)

        if (aiError) {
          console.error('Error fetching AI conversations:', aiError)
        } else {
          setRecentAIChats(
            (aiData || []).map((chat: any) => ({
              id: chat.id,
              topic: chat.topic || 'General Discussion',
              lastMessage: chat.last_message || 'No messages yet',
              time: new Date(chat.updated_at).toLocaleString(),
              sentiment: chat.sentiment || 'Neutral'
            }))
          )
        }

        // Fetch recommended content for client
        const { data: contentData, error: contentError } = await supabase
          .from('content')
          .select(`
            id,
            title,
            type,
            duration,
            category
          `)
          .limit(6)

        if (contentError) {
          console.error('Error fetching content:', contentError)
        } else {
          setRecommendedContent(
            (contentData || []).map((item: any) => ({
              ...item,
              completed: false // you can add logic to fetch user progress if you want
            }))
          )
        }
      } catch (error) {
        console.error('Error fetching client dashboard data:', error)
      } finally {
        setDataLoading(false)
      }
    }

    if (user && isClient) {
      fetchClientData()
    }
  }, [user, isClient, supabase])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Please sign in to continue</h2>
        <p className="text-muted-foreground">You need to be signed in to access your dashboard.</p>
      </div>
    )
  }

  if (!isClient) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Client Dashboard Not Available</h2>
        <p className="text-muted-foreground">
          This dashboard is only available for therapy clients.
        </p>
      </div>
    )
  }

  const userName = user.name?.split(' ')[0] || 
                   user.firstName || 
                   user.email?.split('@')[0] || 
                   'Client'

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">
              Good day, {userName}!
            </h1>
            <p className="text-muted-foreground">
              How are you feeling today? Let's continue your journey to wellness.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Brain className="h-4 w-4" />
              AI Support
            </Button>
            <Button variant="default" className="gap-2">
              <Heart className="h-4 w-4" />
              Log Mood
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Weekly Mood Average */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Weekly Mood Average
                  </p>
                  <p className="text-2xl font-bold">{weeklyMoodAverage}/10</p>
                  <p className="text-sm text-green-600">+0.5 from last week</p>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-2xl">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sessions Completed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Upcoming Sessions
                  </p>
                  <p className="text-2xl font-bold">{upcomingSessions.length}</p>
                  <p className="text-sm text-blue-600">Sessions scheduled</p>
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-2xl">
                  <Video className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Goals Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Goals Progress
                  </p>
                  <p className="text-2xl font-bold">75%</p>
                  <p className="text-sm text-purple-600">3 of 4 goals</p>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-2xl">
                  <Target className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upcoming Sessions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Sessions
              </CardTitle>
              <CardDescription>
                Your scheduled therapy sessions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {dataLoading ? (
                <div className="text-center py-4">
                  <div className="animate-pulse text-muted-foreground">Loading sessions...</div>
                </div>
              ) : upcomingSessions.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">No upcoming sessions scheduled</p>
              ) : (
                upcomingSessions.map((session) => {
                  const sessionDate = new Date(session.session_date)
                  const today = new Date()
                  const tomorrow = new Date()
                  tomorrow.setDate(tomorrow.getDate() + 1)

                  let dateLabel = sessionDate.toLocaleDateString()
                  if (sessionDate.toDateString() === today.toDateString()) {
                    dateLabel = 'Today'
                  } else if (sessionDate.toDateString() === tomorrow.toDateString()) {
                    dateLabel = 'Tomorrow'
                  }

                  const therapist = session.therapist
                  const therapistName = therapist?.name || 
                                      (therapist?.first_name && therapist?.last_name 
                                        ? `${therapist.first_name} ${therapist.last_name}` 
                                        : therapist?.first_name || 'Therapist')

                  return (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                            {therapistName.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">Dr. {therapistName}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{dateLabel} at {session.session_time}</span>
                            <span>•</span>
                            <span className="text-blue-600">
                              {session.session_type || 'Individual Therapy'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          session.status === 'confirmed' 
                            ? 'bg-green-500' 
                            : 'bg-yellow-500'
                        }`} />
                        <Button variant="ghost" size="sm">
                          <Video className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })
              )}
              <Button variant="outline" className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                Request New Session
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Support Chat */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Support
              </CardTitle>
              <CardDescription>
                Recent conversations with your AI assistant
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {dataLoading ? (
                <div className="text-center py-4">
                  <div className="animate-pulse text-muted-foreground">Loading conversations...</div>
                </div>
              ) : recentAIChats.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted-foreground mb-3">No AI conversations yet</p>
                  <p className="text-sm text-muted-foreground">Start a conversation with your AI assistant for 24/7 support</p>
                </div>
              ) : (
                recentAIChats.map((chat) => (
                  <div
                    key={chat.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{chat.topic}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {chat.lastMessage}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{chat.time}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          chat.sentiment === 'Improved' 
                            ? 'bg-green-100 text-green-700'
                            : chat.sentiment === 'Neutral'
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {chat.sentiment}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))
              )}
              <Button variant="default" className="w-full">
                <MessageCircle className="h-4 w-4 mr-2" />
                Start New Conversation
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recommended Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Recommended for You
            </CardTitle>
            <CardDescription>
              Personalized content based on your therapy goals and progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {dataLoading ? (
                <div className="text-center py-4">
                  <div className="animate-pulse text-muted-foreground">Loading recommendations...</div>
                </div>
              ) : recommendedContent.length === 0 ? (
                <div className="col-span-3 text-center py-8">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2">No recommended content available</p>
                  <p className="text-sm text-muted-foreground">Content will appear here based on your therapy progress</p>
                </div>
              ) : (
                recommendedContent.map((content) => (
                  <div
                    key={content.id}
                    className="p-4 rounded-xl border bg-card hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-2 rounded-lg ${
                        content.type === 'Meditation' 
                          ? 'bg-green-100 text-green-600'
                          : content.type === 'Article'
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-purple-100 text-purple-600'
                      }`}>
                        {content.type === 'Meditation' ? (
                          <Brain className="h-4 w-4" />
                        ) : content.type === 'Article' ? (
                          <BookOpen className="h-4 w-4" />
                        ) : (
                          <Zap className="h-4 w-4" />
                        )}
                      </div>
                      {content.completed && (
                        <div className="bg-green-100 text-green-600 p-1 rounded-full">
                          ✓
                        </div>
                      )}
                    </div>
                    
                    <h3 className="font-medium text-sm mb-2">{content.title}</h3>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <span>{content.category}</span>
                      <span>{content.duration}</span>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-center gap-2"
                    >
                      <Play className="h-3 w-3" />
                      {content.completed ? 'Review' : 'Start'}
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}