'use client'

import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  Users, 
  MessageCircle, 
  TrendingUp, 
  Clock, 
  DollarSign,
  Brain,
  AlertTriangle,
  CheckCircle,
  Video
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const stats = [
  {
    title: 'Total Clients',
    value: '24',
    change: '+2 this month',
    icon: Users,
    gradient: 'bg-gradient-therapy'
  },
  {
    title: 'Sessions This Week',
    value: '18',
    change: '+3 from last week',
    icon: Calendar,
    gradient: 'bg-gradient-wellness'
  },
  {
    title: 'Monthly Revenue',
    value: '$3,200',
    change: '+12% from last month',
    icon: DollarSign,
    gradient: 'bg-gradient-mindful'
  },
  {
    title: 'Avg Session Rating',
    value: '4.9',
    change: 'Excellent feedback',
    icon: TrendingUp,
    gradient: 'bg-gradient-to-r from-yellow-400 to-orange-500'
  }
]

const upcomingSessions = [
  {
    id: 1,
    client: 'Alex Morgan',
    time: '10:00 AM',
    date: 'Today',
    type: 'Individual',
    status: 'confirmed',
    avatar: null
  },
  {
    id: 2,
    client: 'Jamie Chen & Taylor Rivera',
    time: '2:00 PM',
    date: 'Today',
    type: 'Couple',
    status: 'confirmed',
    avatar: null
  },
  {
    id: 3,
    client: 'Sarah Johnson',
    time: '9:00 AM',
    date: 'Tomorrow',
    type: 'Individual',
    status: 'pending',
    avatar: null
  }
]

const recentActivity = [
  {
    id: 1,
    type: 'session_completed',
    message: 'Session with Alex Morgan completed',
    time: '2 hours ago',
    icon: CheckCircle,
    color: 'text-green-600'
  },
  {
    id: 2,
    type: 'ai_escalation',
    message: 'AI escalated conversation from Jamie Chen',
    time: '4 hours ago',
    icon: Brain,
    color: 'text-blue-600'
  },
  {
    id: 3,
    type: 'crisis_alert',
    message: 'Crisis keyword detected in client message',
    time: '6 hours ago',
    icon: AlertTriangle,
    color: 'text-red-600'
  },
  {
    id: 4,
    type: 'message',
    message: 'New message from Taylor Rivera',
    time: '1 day ago',
    icon: MessageCircle,
    color: 'text-blue-600'
  }
]

export default function TherapistDashboard() {
  const { data: session } = useSession()
  const userName = session?.user?.name || 'Dr. Therapist'

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
              Welcome back, {userName.split(' ')[0]}!
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening with your practice today
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              Schedule Session
            </Button>
            <Button variant="therapy" className="gap-2">
              <Video className="h-4 w-4" />
              Start Session
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <Card className="card-hover">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-green-600">{stat.change}</p>
                    </div>
                    <div className={`${stat.gradient} p-3 rounded-2xl`}>
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
                <Clock className="h-5 w-5" />
                Upcoming Sessions
              </CardTitle>
              <CardDescription>
                Your scheduled sessions for today and tomorrow
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
                      <AvatarImage src={session.avatar || ''} />
                      <AvatarFallback className="bg-gradient-therapy text-white">
                        {session.client.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{session.client}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{session.date} at {session.time}</span>
                        <span>•</span>
                        <span className={
                          session.type === 'Couple' 
                            ? 'text-mindful-600' 
                            : 'text-therapy-600'
                        }>
                          {session.type}
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
              ))}
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
                Latest updates and notifications from your practice
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity) => {
                const Icon = activity.icon
                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors"
                  >
                    <div className={`p-2 rounded-lg bg-muted ${activity.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts for your practice
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                <Users className="h-6 w-6" />
                <span className="text-sm">View Clients</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                <Calendar className="h-6 w-6" />
                <span className="text-sm">Calendar</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                <MessageCircle className="h-6 w-6" />
                <span className="text-sm">Messages</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                <TrendingUp className="h-6 w-6" />
                <span className="text-sm">Analytics</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
