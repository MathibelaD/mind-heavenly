'use client'

import { useState, useEffect } from 'react'
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
  Video,
  Heart,
  BookOpen,
  Play,
  Sparkles
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card'
import { Button } from '../../../../components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../../../../components/ui/avatar'
import { useAuth } from '../../../../lib/hooks/useAuth'

export default function TherapistDashboard() {
  const { user, loading, supabase } = useAuth()
  const [clients, setClients] = useState<any[]>([])
  const [sessions, setSessions] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalClients: 0,
    weeklyRevenue: 0,
    monthlyRevenue: 0,
    avgRating: 4.9
  })

  // Check if user is a therapist
  const isTherapist = user?.role === 'THERAPIST'

  // Fetch therapist data
  useEffect(() => {
    async function fetchTherapistData() {
      if (!user?.id || !isTherapist) return

      try {
        // Fetch clients assigned to this therapist
        const { data: clientsData } = await supabase
          .from('client_therapist_assignments')
          .select(`
            client_id,
            assigned_at,
            client:users!client_therapist_assignments_client_id_fkey(
              id,
              name,
              first_name,
              last_name,
              email,
              role
            )
          `)
          .eq('therapist_id', user.id)

        if (clientsData) {
          setClients(clientsData.map(assignment => assignment.client))
        }

        // Fetch recent sessions
        const { data: sessionsData } = await supabase
          .from('therapy_sessions')
          .select(`
            id,
            session_date,
            session_time,
            status,
            session_type,
            client:users!sessions_client_id_fkey(
              id,
              name,
              first_name,
              last_name,
              email
            )
          `)
          .eq('therapist_id', user.id)
          .order('session_date', { ascending: true })
          .limit(10)

        if (sessionsData) {
          setSessions(sessionsData)
        }

        // Update stats
        setStats(prev => ({
          ...prev,
          totalClients: clientsData?.length || 0,
          weeklyRevenue: 1800, // Mock data - replace with actual calculation
          monthlyRevenue: 3200 // Mock data - replace with actual calculation
        }))

      } catch (error) {
        console.error('Error fetching therapist data:', error)
      }
    }

    if (user && isTherapist) {
      fetchTherapistData()
    }
  }, [user, isTherapist, supabase])

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
        <p className="text-muted-foreground">You need to be signed in to access your therapist dashboard.</p>
      </div>
    )
  }

  if (!isTherapist) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Therapist Dashboard Not Available</h2>
        <p className="text-muted-foreground">
          This dashboard is only available for licensed therapists.
        </p>
      </div>
    )
  }

  const userName = user.name?.split(' ')[0] || 
                   user.firstName || 
                   user.email?.split('@')[0] || 
                   'Doctor'

  const statsData = [
    {
      title: 'Total Clients',
      value: stats.totalClients.toString(),
      change: '+2 this month',
      icon: Users,
      gradient: 'bg-gradient-to-r from-blue-500 to-blue-600'
    },
    {
      title: 'Sessions This Week',
      value: sessions.filter(s => {
        const sessionDate = new Date(s.session_date)
        const now = new Date()
        const weekStart = new Date(now.setDate(now.getDate() - now.getDay()))
        return sessionDate >= weekStart
      }).length.toString(),
      change: '+3 from last week',
      icon: Calendar,
      gradient: 'bg-gradient-to-r from-green-500 to-green-600'
    },
    {
      title: 'Monthly Revenue',
      value: `$${stats.monthlyRevenue.toLocaleString()}`,
      change: '+12% from last month',
      icon: DollarSign,
      gradient: 'bg-gradient-to-r from-purple-500 to-purple-600'
    },
    {
      title: 'Avg Session Rating',
      value: stats.avgRating.toString(),
      change: 'Excellent feedback',
      icon: TrendingUp,
      gradient: 'bg-gradient-to-r from-yellow-400 to-orange-500'
    }
  ]

  // Get upcoming sessions (next 3 sessions)
  const upcomingSessions = sessions
    .filter(session => {
      const sessionDateTime = new Date(`${session.session_date} ${session.session_time}`)
      return sessionDateTime >= new Date()
    })
    .slice(0, 3)
    .map(session => {
      const sessionDate = new Date(session.session_date)
      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      
      let dateLabel = sessionDate.toLocaleDateString()
      if (sessionDate.toDateString() === today.toDateString()) {
        dateLabel = 'Today'
      } else if (sessionDate.toDateString() === tomorrow.toDateString()) {
        dateLabel = 'Tomorrow'
      }

      const client = session.client
      const clientName = client.name || 
                        (client.first_name && client.last_name 
                          ? `${client.first_name} ${client.last_name}` 
                          : client.first_name || client.email)

      return {
        id: session.id,
        client: clientName,
        time: session.session_time,
        date: dateLabel,
        type: session.session_type || 'Individual',
        status: session.status || 'confirmed',
        avatar: null
      }
    })

  const recentActivity = [
    {
      id: 1,
      type: 'session_completed',
      message: 'Session with client completed',
      time: '2 hours ago',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      id: 2,
      type: 'ai_escalation',
      message: 'AI escalated conversation from client',
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
      message: 'New message from client',
      time: '1 day ago',
      icon: MessageCircle,
      color: 'text-blue-600'
    }
  ]

  const therapyResources = [
    {
      id: 1,
      title: "CBT Worksheet Templates",
      category: "Cognitive Behavioral Therapy",
      duration: "5 min setup",
      type: "Template",
      usageCount: 12,
      totalClients: stats.totalClients
    },
    {
      id: 2,
      title: "Mindfulness Meditation Guide",
      category: "Mindfulness",
      duration: "15 min",
      type: "Audio",
      usageCount: 8,
      totalClients: stats.totalClients
    },
    {
      id: 3,
      title: "Couples Communication Exercise",
      category: "Relationship Therapy",
      duration: "20 min",
      type: "Exercise",
      usageCount: 5,
      totalClients: stats.totalClients
    }
  ]

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
              Welcome back, Dr. {userName}!
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
            <Button variant="default" className="gap-2">
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
        {statsData.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
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
              {upcomingSessions.length > 0 ? (
                upcomingSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={session.avatar || ''} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                          {session.client.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{session.client}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{session.date} at {session.time}</span>
                          <span>•</span>
                          <span className={
                            session.type === 'Couple' 
                              ? 'text-purple-600' 
                              : 'text-blue-600'
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
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No upcoming sessions scheduled
                </div>
              )}
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
                    <div className={`p-2 rounded-lg ${
                      activity.type === 'session_completed' 
                        ? 'bg-green-100 text-green-600'
                        : activity.type === 'ai_escalation'
                        ? 'bg-blue-100 text-blue-600'
                        : activity.type === 'crisis_alert'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-purple-100 text-purple-600'
                    }`}>
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

      {/* Therapy Resources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Therapy Resources
            </CardTitle>
            <CardDescription>
              Tools and resources for your practice
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {therapyResources.map((resource) => (
                <div
                  key={resource.id}
                  className="p-4 rounded-xl border bg-card hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2 rounded-lg ${
                      resource.type === 'Template' 
                        ? 'bg-blue-100 text-blue-600'
                        : resource.type === 'Audio'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-purple-100 text-purple-600'
                    }`}>
                      {resource.type === 'Template' ? (
                        <BookOpen className="h-4 w-4" />
                      ) : resource.type === 'Audio' ? (
                        <Brain className="h-4 w-4" />
                      ) : (
                        <Heart className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground">
                        {resource.usageCount} uses
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="font-medium text-sm mb-2">{resource.title}</h3>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <span>{resource.category}</span>
                    <span>{resource.duration}</span>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-center gap-2"
                  >
                    <Play className="h-3 w-3" />
                    Use Resource
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
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