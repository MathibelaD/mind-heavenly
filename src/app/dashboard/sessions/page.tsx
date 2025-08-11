'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { 
  Video, 
  Users, 
  User, 
  Clock, 
  Calendar, 
  MessageCircle,
  FileText,
  Star,
  Play,
  MoreHorizontal,
  Filter,
  Search
} from 'lucide-react'
import { format, addDays, isAfter, isBefore } from 'date-fns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface Session {
  id: string
  title: string
  type: 'INDIVIDUAL' | 'COUPLE' | 'GROUP'
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  date: Date
  startTime: string
  endTime: string
  duration: number
  therapist: {
    id: string
    name: string
    image?: string
  }
  client: {
    id: string
    name: string
    image?: string
  }
  partner?: {
    id: string
    name: string
    image?: string
  }
  notes?: string
  aiSummary?: string
  rating?: number
  cost: number
  location: 'video' | 'in-person'
  meetingLink?: string
  recordingUrl?: string
}

// Mock data
const mockSessions: Session[] = [
  {
    id: '1',
    title: 'Individual Therapy Session',
    type: 'INDIVIDUAL',
    status: 'SCHEDULED',
    date: addDays(new Date(), 1),
    startTime: '14:00',
    endTime: '14:50',
    duration: 50,
    therapist: { id: 't1', name: 'Dr. Sarah Johnson' },
    client: { id: 'c1', name: 'Alex Morgan' },
    notes: 'Working on anxiety management and coping strategies',
    cost: 150,
    location: 'video',
    meetingLink: 'https://meet.mindheavenly.com/session/1'
  },
  {
    id: '2',
    title: 'Couples Therapy Session',
    type: 'COUPLE',
    status: 'COMPLETED',
    date: addDays(new Date(), -3),
    startTime: '15:00',
    endTime: '16:00',
    duration: 60,
    therapist: { id: 't1', name: 'Dr. Sarah Johnson' },
    client: { id: 'c2', name: 'Jamie Chen' },
    partner: { id: 'c3', name: 'Taylor Rivera' },
    notes: 'Communication patterns and conflict resolution',
    aiSummary: 'Made good progress on active listening techniques. Both partners showed improvement in expressing needs without blame language.',
    rating: 5,
    cost: 200,
    location: 'video',
    recordingUrl: 'https://recordings.mindheavenly.com/session/2'
  },
  {
    id: '3',
    title: 'Follow-up Session',
    type: 'INDIVIDUAL',
    status: 'COMPLETED',
    date: addDays(new Date(), -7),
    startTime: '10:00',
    endTime: '10:50',
    duration: 50,
    therapist: { id: 't1', name: 'Dr. Sarah Johnson' },
    client: { id: 'c1', name: 'Alex Morgan' },
    notes: 'Review progress on anxiety management',
    aiSummary: 'Client reported significant improvement in anxiety levels. Daily mindfulness practice is helping. Continue current strategies.',
    rating: 4,
    cost: 150,
    location: 'video'
  }
]

export default function SessionsPage() {
  const { data: session } = useSession()
  const [sessions] = useState<Session[]>(mockSessions)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)

  const userRole = session?.user?.role
  const isTherapist = userRole === 'THERAPIST'

  const filteredSessions = sessions.filter(sess => {
    const matchesSearch = sess.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sess.therapist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sess.client.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || sess.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const upcomingSessions = filteredSessions.filter(sess => 
    sess.status === 'SCHEDULED' && isAfter(sess.date, new Date())
  )
  
  const pastSessions = filteredSessions.filter(sess => 
    sess.status === 'COMPLETED' && isBefore(sess.date, new Date())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'IN_PROGRESS':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'COMPLETED':
        return 'text-gray-600 bg-gray-50 border-gray-200'
      case 'CANCELLED':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'INDIVIDUAL':
        return 'text-therapy-600 bg-therapy-50'
      case 'COUPLE':
        return 'text-mindful-600 bg-mindful-50'
      case 'GROUP':
        return 'text-wellness-600 bg-wellness-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const canJoinSession = (sess: Session) => {
    const now = new Date()
    const sessionStart = new Date(sess.date)
    const sessionEnd = new Date(sess.date)
    
    // Set the actual time
    const [startHour, startMinute] = sess.startTime.split(':').map(Number)
    const [endHour, endMinute] = sess.endTime.split(':').map(Number)
    
    sessionStart.setHours(startHour, startMinute, 0, 0)
    sessionEnd.setHours(endHour, endMinute, 0, 0)
    
    // Allow joining 15 minutes before and during session
    const joinWindowStart = new Date(sessionStart.getTime() - 15 * 60 * 1000)
    
    return now >= joinWindowStart && now <= sessionEnd && sess.status === 'SCHEDULED'
  }

  const SessionCard = ({ sess }: { sess: Session }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border rounded-2xl p-6 hover:shadow-md transition-all cursor-pointer"
      onClick={() => setSelectedSession(sess)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${getTypeColor(sess.type)}`}>
            {sess.type === 'INDIVIDUAL' ? (
              <User className="h-5 w-5" />
            ) : (
              <Users className="h-5 w-5" />
            )}
          </div>
          <div>
            <h3 className="font-semibold">{sess.title}</h3>
            <p className="text-sm text-muted-foreground">
              {format(sess.date, 'MMM d, yyyy')} at {sess.startTime}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(sess.status)}`}>
            {sess.status.replace('_', ' ')}
          </span>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{sess.duration} minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <Video className="h-4 w-4 text-muted-foreground" />
              <span>{sess.location === 'video' ? 'Video Call' : 'In Person'}</span>
            </div>
          </div>
          <span className="font-medium">${sess.cost}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <Avatar className="h-8 w-8 border-2 border-background">
              <AvatarFallback className="bg-gradient-therapy text-white text-xs">
                {isTherapist ? sess.client.name.split(' ').map(n => n[0]).join('') : sess.therapist.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            {sess.partner && (
              <Avatar className="h-8 w-8 border-2 border-background">
                <AvatarFallback className="bg-gradient-mindful text-white text-xs">
                  {sess.partner.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
          <div className="text-sm">
            {isTherapist ? (
              <span>
                {sess.client.name}{sess.partner ? ` & ${sess.partner.name}` : ''}
              </span>
            ) : (
              <span>{sess.therapist.name}</span>
            )}
          </div>
        </div>

        {sess.rating && (
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < sess.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">Session rating</span>
          </div>
        )}

        {sess.notes && (
          <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-xl">
            {sess.notes}
          </p>
        )}

        <div className="flex gap-2 pt-2">
          {canJoinSession(sess) && (
            <Button variant="therapy" size="sm" className="gap-2">
              <Play className="h-4 w-4" />
              Join Session
            </Button>
          )}
          
          {sess.status === 'COMPLETED' && (
            <>
              <Button variant="outline" size="sm" className="gap-2">
                <FileText className="h-4 w-4" />
                Notes
              </Button>
              {sess.recordingUrl && (
                <Button variant="outline" size="sm" className="gap-2">
                  <Video className="h-4 w-4" />
                  Recording
                </Button>
              )}
            </>
          )}
          
          <Button variant="outline" size="sm" className="gap-2">
            <MessageCircle className="h-4 w-4" />
            Message
          </Button>
        </div>
      </div>
    </motion.div>
  )

  const SessionDetailDialog = () => (
    <Dialog open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
      <DialogContent className="max-w-2xl">
        {selectedSession && (
          <>
            <DialogHeader>
              <DialogTitle>{selectedSession.title}</DialogTitle>
              <DialogDescription>
                {format(selectedSession.date, 'MMMM d, yyyy')} at {selectedSession.startTime} - {selectedSession.endTime}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Session Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Participants</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-gradient-therapy text-white text-xs">
                          {selectedSession.therapist.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{selectedSession.therapist.name} (Therapist)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-gradient-wellness text-white text-xs">
                          {selectedSession.client.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{selectedSession.client.name}</span>
                    </div>
                    {selectedSession.partner && (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="bg-gradient-mindful text-white text-xs">
                            {selectedSession.partner.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{selectedSession.partner.name}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Session Details</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div>Type: {selectedSession.type}</div>
                    <div>Duration: {selectedSession.duration} minutes</div>
                    <div>Location: {selectedSession.location === 'video' ? 'Video Call' : 'In Person'}</div>
                    <div>Cost: ${selectedSession.cost}</div>
                  </div>
                </div>
              </div>

              {/* Session Notes */}
              {selectedSession.notes && (
                <div>
                  <h4 className="font-medium mb-2">Session Notes</h4>
                  <p className="text-sm bg-muted/50 p-3 rounded-xl">
                    {selectedSession.notes}
                  </p>
                </div>
              )}

              {/* AI Summary */}
              {selectedSession.aiSummary && (
                <div>
                  <h4 className="font-medium mb-2">AI Summary</h4>
                  <p className="text-sm bg-blue-50 p-3 rounded-xl">
                    {selectedSession.aiSummary}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3">
                {canJoinSession(selectedSession) && (
                  <Button variant="therapy" className="gap-2">
                    <Play className="h-4 w-4" />
                    Join Session
                  </Button>
                )}
                
                <Button variant="outline" className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Message
                </Button>
                
                {selectedSession.status === 'COMPLETED' && selectedSession.recordingUrl && (
                  <Button variant="outline" className="gap-2">
                    <Video className="h-4 w-4" />
                    View Recording
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
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
              {isTherapist ? 'Session Management' : 'My Sessions'}
            </h1>
            <p className="text-muted-foreground">
              {isTherapist 
                ? 'Manage and track your therapy sessions'
                : 'View your past and upcoming therapy sessions'
              }
            </p>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search sessions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('all')}
                >
                  All
                </Button>
                <Button
                  variant={statusFilter === 'SCHEDULED' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('SCHEDULED')}
                >
                  Upcoming
                </Button>
                <Button
                  variant={statusFilter === 'COMPLETED' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('COMPLETED')}
                >
                  Completed
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Upcoming Sessions */}
      {upcomingSessions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Sessions
              </CardTitle>
              <CardDescription>
                {upcomingSessions.length} session{upcomingSessions.length > 1 ? 's' : ''} scheduled
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingSessions.map((sess) => (
                <SessionCard key={sess.id} sess={sess} />
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Past Sessions */}
      {pastSessions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Past Sessions
              </CardTitle>
              <CardDescription>
                {pastSessions.length} completed session{pastSessions.length > 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pastSessions.map((sess) => (
                <SessionCard key={sess.id} sess={sess} />
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {filteredSessions.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-12 text-center">
              <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No sessions found</h3>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? 'Try adjusting your search terms or filters'
                  : 'You don\'t have any sessions yet. Schedule your first session to get started.'
                }
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <SessionDetailDialog />
    </div>
  )
}
