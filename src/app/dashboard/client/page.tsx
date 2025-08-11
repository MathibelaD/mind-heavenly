'use client'

import { useSession } from 'next-auth/react'
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

const moodData = [
  { day: 'Mon', mood: 8 },
  { day: 'Tue', mood: 6 },
  { day: 'Wed', mood: 7 },
  { day: 'Thu', mood: 9 },
  { day: 'Fri', mood: 8 },
  { day: 'Sat', mood: 7 },
  { day: 'Sun', mood: 8 },
]

const upcomingSessions = [
  {
    id: 1,
    therapist: 'Dr. Sarah Johnson',
    time: '2:00 PM',
    date: 'Today',
    type: 'Individual Therapy',
    status: 'confirmed'
  },
  {
    id: 2,
    therapist: 'Dr. Sarah Johnson',
    time: '2:00 PM',
    date: 'Next Monday',
    type: 'Individual Therapy',
    status: 'scheduled'
  }
]

const recommendedContent = [
  {
    id: 1,
    title: '5-Minute Breathing Exercise',
    type: 'Meditation',
    duration: '5 min',
    category: 'Anxiety Management',
    completed: false
  },
  {
    id: 2,
    title: 'Understanding Anxiety Triggers',
    type: 'Article',
    duration: '8 min read',
    category: 'Education',
    completed: true
  },
  {
    id: 3,
    title: 'Progressive Muscle Relaxation',
    type: 'Exercise',
    duration: '12 min',
    category: 'Relaxation',
    completed: false
  }
]

const recentAIChats = [
  {
    id: 1,
    topic: 'Work stress and anxiety',
    lastMessage: 'Thank you for the breathing exercises...',
    time: '2 hours ago',
    sentiment: 'Improved'
  },
  {
    id: 2,
    topic: 'Sleep difficulties',
    lastMessage: 'I\'ve been having trouble sleeping...',
    time: '1 day ago',
    sentiment: 'Neutral'
  }
]

export default function ClientDashboard() {
  const { data: session } = useSession()
  const userName = session?.user?.name || 'Alex'

  const weeklyMoodAverage = Math.round(
    moodData.reduce((sum, day) => sum + day.mood, 0) / moodData.length
  )

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
            <Button variant="wellness" className="gap-2">
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
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Weekly Mood Average
                </p>
                <p className="text-2xl font-bold">{weeklyMoodAverage}/10</p>
                <p className="text-sm text-green-600">+0.5 from last week</p>
              </div>
              <div className="bg-gradient-wellness p-3 rounded-2xl">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Sessions Completed
                </p>
                <p className="text-2xl font-bold">8</p>
                <p className="text-sm text-blue-600">This month</p>
              </div>
              <div className="bg-gradient-therapy p-3 rounded-2xl">
                <Video className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Goals Progress
                </p>
                <p className="text-2xl font-bold">75%</p>
                <p className="text-sm text-purple-600">3 of 4 goals</p>
              </div>
              <div className="bg-gradient-mindful p-3 rounded-2xl">
                <Target className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
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
              {upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-therapy text-white">
                        SJ
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{session.therapist}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{session.date} at {session.time}</span>
                        <span>•</span>
                        <span className="text-therapy-600">
                          {session.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      session.status === 'confirmed' 
                        ? 'bg-green-500' 
                        : 'bg-blue-500'
                    }`} />
                    <Button variant="ghost" size="sm">
                      <Video className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule New Session
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
              {recentAIChats.map((chat) => (
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
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {chat.sentiment}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
              <Button variant="therapy" className="w-full">
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
              {recommendedContent.map((content) => (
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
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{content.category}</span>
                    <span>{content.duration}</span>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full mt-3 justify-center gap-2"
                  >
                    <Play className="h-3 w-3" />
                    {content.completed ? 'Review' : 'Start'}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
