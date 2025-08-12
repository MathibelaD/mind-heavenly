'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  Video, 
  Users, 
  User,
  MapPin,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { format, addDays, isSameDay, isAfter, isBefore, startOfDay } from 'date-fns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card'
import { Button } from '../../../../components/ui/button'
import { Calendar } from '../../../../components/ui/calendar'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../../../components/ui/dialog'
import { Avatar, AvatarFallback } from '../../../../components/ui/avatar'
import { useAuth } from '../../../../lib/hooks/useAuth'

interface SessionEvent {
  id: string
  title: string
  date: Date
  startTime: string
  endTime: string
  type: 'INDIVIDUAL' | 'COUPLE' | 'GROUP'
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  therapist?: {
    name: string
    image?: string
  }
  client?: {
    name: string
    image?: string
  }
  partner?: {
    name: string
    image?: string
  }
  location: 'video' | 'in-person'
  notes?: string
}

// Mock data - in production, this would come from API
const mockSessions: SessionEvent[] = [
  {
    id: '1',
    title: 'Individual Therapy Session',
    date: new Date(),
    startTime: '14:00',
    endTime: '14:50',
    type: 'INDIVIDUAL',
    status: 'SCHEDULED',
    therapist: { name: 'Dr. Sarah Johnson' },
    client: { name: 'Alex Morgan' },
    location: 'video',
    notes: 'Working on anxiety management techniques'
  },
  {
    id: '2',
    title: 'Couples Therapy Session',
    date: addDays(new Date(), 2),
    startTime: '15:00',
    endTime: '16:00',
    type: 'COUPLE',
    status: 'SCHEDULED',
    therapist: { name: 'Dr. Sarah Johnson' },
    client: { name: 'Jamie Chen' },
    partner: { name: 'Taylor Rivera' },
    location: 'video',
    notes: 'Communication patterns and conflict resolution'
  },
  {
    id: '3',
    title: 'Follow-up Session',
    date: addDays(new Date(), 7),
    startTime: '10:00',
    endTime: '10:50',
    type: 'INDIVIDUAL',
    status: 'SCHEDULED',
    therapist: { name: 'Dr. Sarah Johnson' },
    client: { name: 'Alex Morgan' },
    location: 'video'
  }
]

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
]

export default function CalendarPage() {
  const { user } = useAuth()
  
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [sessions, setSessions] = useState<SessionEvent[]>(mockSessions)
  const [showBookingDialog, setShowBookingDialog] = useState(false)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('')

  const userRole = user?.role
  const isTherapist = userRole === 'THERAPIST'

  const getSessionsForDate = (date: Date) => {
    return sessions.filter(session => isSameDay(session.date, date))
  }

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return <Clock className="h-4 w-4" />
      case 'IN_PROGRESS':
        return <Video className="h-4 w-4" />
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4" />
      case 'CANCELLED':
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'INDIVIDUAL':
        return <User className="h-4 w-4" />
      case 'COUPLE':
        return <Users className="h-4 w-4" />
      case 'GROUP':
        return <Users className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const isTimeSlotAvailable = (time: string, date: Date) => {
    const sessionsForDate = getSessionsForDate(date)
    return !sessionsForDate.some(session => 
      session.startTime === time && session.status !== 'CANCELLED'
    )
  }

  const canBookSession = (date: Date) => {
    const today = startOfDay(new Date())
    return isAfter(date, today) || isSameDay(date, today)
  }

  const selectedDateSessions = getSessionsForDate(selectedDate)

  const BookingDialog = () => (
    <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Schedule New Session</DialogTitle>
          <DialogDescription>
            Book a therapy session for {format(selectedDate, 'MMMM d, yyyy')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Session Type Selection */}
          <div className="space-y-3">
            <h3 className="font-medium">Session Type</h3>
            <div className="grid grid-cols-2 gap-3">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-therapy-100 p-2 rounded-lg">
                      <User className="h-5 w-5 text-therapy-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Individual Therapy</h4>
                      <p className="text-sm text-muted-foreground">50 minutes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {(userRole === 'COUPLE_PARTNER_1' || userRole === 'COUPLE_PARTNER_2') && (
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-mindful-100 p-2 rounded-lg">
                        <Users className="h-5 w-5 text-mindful-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Couples Therapy</h4>
                        <p className="text-sm text-muted-foreground">60 minutes</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Time Slot Selection */}
          <div className="space-y-3">
            <h3 className="font-medium">Available Times</h3>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map(time => {
                const available = isTimeSlotAvailable(time, selectedDate)
                return (
                  <Button
                    key={time}
                    variant={selectedTimeSlot === time ? "default" : "outline"}
                    disabled={!available}
                    onClick={() => setSelectedTimeSlot(time)}
                    className="h-auto p-3"
                  >
                    <div className="text-center">
                      <div className="font-medium">{time}</div>
                      {!available && (
                        <div className="text-xs text-muted-foreground">Unavailable</div>
                      )}
                    </div>
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Therapist Selection (for non-therapist users) */}
          {!isTherapist && (
            <div className="space-y-3">
              <h3 className="font-medium">Select Therapist</h3>
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-gradient-therapy text-white">
                        SJ
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">Dr. Sarah Johnson</h4>
                      <p className="text-sm text-muted-foreground">
                        Licensed Clinical Psychologist
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>★ 4.9</span>
                        <span>•</span>
                        <span>12+ years experience</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowBookingDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="therapy"
              disabled={!selectedTimeSlot}
              onClick={() => {
                // Handle booking logic here
                console.log('Booking session for', selectedDate, 'at', selectedTimeSlot)
                setShowBookingDialog(false)
                setSelectedTimeSlot('')
              }}
            >
              Book Session
            </Button>
          </div>
        </div>
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
              {isTherapist ? 'Session Calendar' : 'My Appointments'}
            </h1>
            <p className="text-muted-foreground">
              {isTherapist 
                ? 'Manage your therapy sessions and availability'
                : 'View and schedule your therapy sessions'
              }
            </p>
          </div>
          {!isTherapist && (
            <Button 
              variant="therapy" 
              className="gap-2"
              onClick={() => setShowBookingDialog(true)}
              disabled={!canBookSession(selectedDate)}
            >
              <Plus className="h-4 w-4" />
              Book Session
            </Button>
          )}
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-1"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border"
                modifiers={{
                  hasSession: (date) => getSessionsForDate(date).length > 0
                }}
                modifiersStyles={{
                  hasSession: {
                    fontWeight: 'bold',
                    backgroundColor: 'hsl(var(--primary))',
                    color: 'hsl(var(--primary-foreground))'
                  }
                }}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Session List */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle>
                Sessions for {format(selectedDate, 'MMMM d, yyyy')}
              </CardTitle>
              <CardDescription>
                {selectedDateSessions.length === 0 
                  ? 'No sessions scheduled for this date'
                  : `${selectedDateSessions.length} session${selectedDateSessions.length > 1 ? 's' : ''} scheduled`
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedDateSessions.length === 0 ? (
                <div className="text-center py-12">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No sessions scheduled</h3>
                  <p className="text-muted-foreground mb-4">
                    {canBookSession(selectedDate) 
                      ? 'Would you like to schedule a session for this date?'
                      : 'Select a future date to schedule sessions'
                    }
                  </p>
                  {!isTherapist && canBookSession(selectedDate) && (
                    <Button 
                      variant="outline" 
                      onClick={() => setShowBookingDialog(true)}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Schedule Session
                    </Button>
                  )}
                </div>
              ) : (
                selectedDateSessions.map((session) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border rounded-2xl p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(session.type)}
                            <h3 className="font-semibold">{session.title}</h3>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(session.status)}`}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(session.status)}
                              {session.status.replace('_', ' ')}
                            </div>
                          </span>
                        </div>
                        
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{session.startTime} - {session.endTime}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{session.location === 'video' ? 'Video Call' : 'In Person'}</span>
                          </div>
                          
                          {isTherapist ? (
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <span>
                                {session.client?.name}
                                {session.partner && ` & ${session.partner.name}`}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <span>{session.therapist?.name}</span>
                            </div>
                          )}
                          
                          {session.notes && (
                            <div className="flex items-start gap-2">
                              <AlertCircle className="h-4 w-4 mt-0.5" />
                              <span>{session.notes}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {session.status === 'SCHEDULED' && (
                          <Button size="sm" variant="outline">
                            <Video className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <BookingDialog />
    </div>
  )
}
