
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../components/ui/card'
import { Avatar, AvatarFallback } from '../../../../components/ui/avatar'
import { 
  Brain, 
  Heart, 
  Calendar, 
  TrendingUp, 
  BookOpen, 
  Video, 
  Users, 
  Play,
  Sparkles 
} from 'lucide-react'
import { useAuth } from '../../../../lib/hooks/useAuth'

export default function CoupleDashboard() {
  const { user, loading, supabase } = useAuth()
  const [partnerName, setPartnerName] = useState<string>('Your Partner')

  // Check if user is a couple partner
  const isCouplePartner = user?.role === 'COUPLE_PARTNER_1' || user?.role === 'COUPLE_PARTNER_2'

  // Fetch partner information
  useEffect(() => {
    async function fetchPartner() {
      if (!user?.id || !isCouplePartner) return

      try {
        // First, get the user's couple_id from the users table
        const { data: userData } = await supabase
          .from('users')
          .select('couple_id')
          .eq('id', user.id)
          .single()

        if (!userData?.couple_id) return

        // Get the couple relationship
        const { data: couple } = await supabase
          .from('couples')
          .select(`
            partner1_id,
            partner2_id,
            partner1:users!couples_partner1_id_fkey(name, first_name, last_name),
            partner2:users!couples_partner2_id_fkey(name, first_name, last_name)
          `)
          .eq('id', userData.couple_id)
          .single()

        if (couple) {
          // Determine which partner is the current user's partner
          const isPartner1 = user.id === couple.partner1_id
          const partner = isPartner1 ? couple.partner2 : couple.partner1
          
          if (partner) {
            const name = partner.name || 
                         (partner.first_name && partner.last_name 
                           ? `${partner.first_name} ${partner.last_name}` 
                           : partner.first_name || 'Your Partner')
            setPartnerName(name)
          }
        }
      } catch (error) {
        console.error('Error fetching partner:', error)
      }
    }

    if (user && isCouplePartner) {
      fetchPartner()
    }
  }, [user, isCouplePartner, supabase])

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
        <p className="text-muted-foreground">You need to be signed in to access your couples dashboard.</p>
      </div>
    )
  }

  if (!isCouplePartner) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Couples Dashboard Not Available</h2>
        <p className="text-muted-foreground">
          This dashboard is only available for couples therapy participants.
        </p>
      </div>
    )
  }

  const userName = user.name?.split(' ')[0] || 
                   user.firstName || 
                   user.email?.split('@')[0] || 
                   'Partner'

  const isPartner1 = user.role === 'COUPLE_PARTNER_1'

  // Mock data - replace with actual data fetching
  const relationshipMetrics = [
    {
      title: "Communication Score",
      value: "8.5/10",
      change: "+1.2 this week",
      gradient: "bg-gradient-to-r from-blue-500 to-blue-600",
      icon: Heart
    },
    {
      title: "Sessions Completed",
      value: "12",
      change: "+2 this month",
      gradient: "bg-gradient-to-r from-green-500 to-green-600",
      icon: Calendar
    },
    {
      title: "Growth Progress",
      value: "75%",
      change: "+15% this month",
      gradient: "bg-gradient-to-r from-purple-500 to-purple-600",
      icon: TrendingUp
    }
  ]

  const upcomingSessions = [
    {
      id: 1,
      therapist: "Dr. Sarah Johnson",
      date: "Tomorrow",
      time: "2:00 PM",
      type: "Couples Session"
    }
  ]

  const recentActivity = [
    {
      id: 1,
      message: "Completed communication exercise",
      time: "2 hours ago",
      type: "content",
      participants: [userName, partnerName]
    },
    {
      id: 2,
      message: "Session with Dr. Johnson completed",
      time: "2 days ago", 
      type: "session",
      participants: [userName, partnerName]
    }
  ]

  const sharedContent = [
    {
      id: 1,
      title: "Daily Gratitude Practice",
      category: "Mindfulness",
      duration: "10 min",
      type: "Meditation",
      completedBy: [userName],
      totalPartners: 2
    },
    {
      id: 2,
      title: "Understanding Love Languages",
      category: "Communication",
      duration: "15 min",
      type: "Article", 
      completedBy: [userName, partnerName],
      totalPartners: 2
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
            <Button variant="default" className="gap-2">
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
              <Card className="hover:shadow-lg transition-shadow">
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
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                        SJ
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{session.therapist}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{session.date} at {session.time}</span>
                        <span>•</span>
                        <span className="text-purple-600">
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
                      ? 'bg-blue-100 text-blue-600'
                      : activity.type === 'content'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-purple-100 text-purple-600'
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
                            <AvatarFallback className="text-xs bg-gradient-to-r from-purple-500 to-purple-600 text-white">
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