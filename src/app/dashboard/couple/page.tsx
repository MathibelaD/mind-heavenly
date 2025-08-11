'use client'

import { useSession } from '@supabase/auth-helpers-react'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  MessageCircle, 
  Heart, 
  Users, 
  BookOpen, 
  TrendingUp,
  Video,
  Brain,
  Play,
  ChevronRight,
  Sparkles,
  Target
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card'
import { Button } from '../../../../components/ui/button'
import { Avatar, AvatarFallback } from '../../../../components/ui/avatar'

const relationshipMetrics = [
  {
    title: 'Communication Score',
    value: '8.2',
    change: '+0.5 this week',
    icon: MessageCircle,
    gradient: 'bg-gradient-mindful'
  },
  {
    title: 'Session Streak',
    value: '4',
    change: 'weeks in a row',
    icon: Calendar,
    gradient: 'bg-gradient-therapy'
  },
  {
    title: 'Shared Goals',
    value: '3/4',
    change: 'goals completed',
    icon: Target,
    gradient: 'bg-gradient-wellness'
  }
]

const upcomingSessions = [
  {
    id: 1,
    therapist: 'Dr. Sarah Johnson',
    time: '2:00 PM',
    date: 'Tomorrow',
    type: 'Couples Therapy',
    status: 'confirmed',
    participants: ['Jamie Chen', 'Taylor Rivera']
  }
]

const sharedContent = [
  {
    id: 1,
    title: 'Effective Communication Techniques',
    type: 'Article',
    duration: '12 min read',
    category: 'Communication',
    completedBy: ['Jamie'],
    totalPartners: 2
  },
  {
    id: 2,
    title: 'Couples Meditation Exercise',
    type: 'Meditation',
    duration: '15 min',
    category: 'Mindfulness',
    completedBy: ['Jamie', 'Taylor'],
    totalPartners: 2
  },
  {
    id: 3,
    title: 'Conflict Resolution Strategies',
    type: 'Exercise',
    duration: '20 min',
    category: 'Relationship Skills',
    completedBy: [],
    totalPartners: 2
  }
]

const recentActivity = [
  {
    id: 1,
    type: 'session',
    message: 'Completed couples therapy session',
    time: '3 days ago',
    participants: ['Jamie', 'Taylor']
  },
  {
    id: 2,
    type: 'content',
    message: 'Taylor completed "Communication Techniques"',
    time: '1 week ago',
    participants: ['Taylor']
  },
  {
    id: 3,
    type: 'milestone',
    message: 'Achieved 1-month therapy milestone!',
    time: '1 week ago',
    participants: ['Jamie', 'Taylor']
  }
]

export default function CoupleDashboard() {
  const session = useSession()
  const userName = session?.user?.name?.split(' ')[0] || 'Partner'
  const isPartner1 = session?.user?.role === 'COUPLE_PARTNER_1'
  const partnerName = isPartner1 ? 'Taylor' : 'Jamie'

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
              Welcome, {userName}!
            </h1>
            <p className="text-muted-foreground">
              Continue your relationship journey with {partnerName}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Brain className="h-4 w-4" />
              AI Support
            </Button>
            <Button variant="mindful" className="gap-2">
              <Heart className="h-4 w-4" />
              Log Mood
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Relationship Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {relationshipMetrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <Card className="card-hover">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {metric.title}
                      </p>
                      <p className="text-2xl font-bold">{metric.value}</p>
                      <p className="text-sm text-green-600">{metric.change}</p>
                    </div>
                    <div className={`${metric.gradient} p-3 rounded-2xl`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
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
                Your scheduled couples therapy sessions
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
                        <span className="text-mindful-600">
                          {session.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          Both partners
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
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

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Latest updates in your relationship journey
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'session' 
                      ? 'bg-therapy-100 text-therapy-600'
                      : activity.type === 'content'
                      ? 'bg-wellness-100 text-wellness-600'
                      : 'bg-mindful-100 text-mindful-600'
                  }`}>
                    {activity.type === 'session' ? (
                      <Video className="h-4 w-4" />
                    ) : activity.type === 'content' ? (
                      <BookOpen className="h-4 w-4" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                      <div className="flex -space-x-1">
                        {activity.participants.map((participant, index) => (
                          <Avatar key={participant} className="h-4 w-4 border border-background">
                            <AvatarFallback className="text-xs bg-gradient-mindful text-white">
                              {participant[0]}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Shared Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Shared Content
            </CardTitle>
            <CardDescription>
              Exercises and resources for both partners to explore together
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {sharedContent.map((content) => (
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
                        <Users className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground">
                        {content.completedBy.length}/{content.totalPartners}
                      </span>
                      <div className="flex -space-x-1">
                        {content.completedBy.map((partner, index) => (
                          <div 
                            key={partner} 
                            className="w-4 h-4 bg-green-500 rounded-full border border-background flex items-center justify-center"
                          >
                            <span className="text-[8px] text-white font-bold">
                              {partner[0]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
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
                    {content.completedBy.includes(userName) ? 'Review' : 'Start'}
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
