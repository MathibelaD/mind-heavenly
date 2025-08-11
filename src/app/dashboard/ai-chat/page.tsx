'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, 
  Brain, 
  AlertTriangle, 
  CheckCircle, 
  Lightbulb,
  User,
  Bot,
  Phone,
  MessageCircle
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface Message {
  id: string
  content: string
  sender: 'user' | 'ai'
  timestamp: Date
  sentiment?: {
    sentiment: string
    crisisLevel: string
    emotions: string[]
  }
  suggestions?: string[]
}

const initialMessages: Message[] = [
  {
    id: '1',
    content: "Hello! I'm your AI therapy assistant. I'm here to listen, support, and help you work through whatever you're experiencing. How are you feeling today?",
    sender: 'ai',
    timestamp: new Date(),
    suggestions: [
      "I'm feeling anxious about work",
      "I've been having trouble sleeping",
      "I want to talk about my relationships"
    ]
  }
]

const crisisResources = [
  {
    name: "National Suicide Prevention Lifeline",
    phone: "988",
    available: "24/7"
  },
  {
    name: "Crisis Text Line",
    phone: "Text HOME to 741741",
    available: "24/7"
  },
  {
    name: "Emergency Services",
    phone: "911",
    available: "24/7"
  }
]

export default function AIChatPage() {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showCrisisAlert, setShowCrisisAlert] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      // Send to AI API
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: inputValue,
          conversationHistory: messages.slice(-5).map(m => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.content
          }))
        })
      })

      const data = await response.json()

      if (data.shouldEscalate) {
        setShowCrisisAlert(true)
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message,
        sender: 'ai',
        timestamp: new Date(),
        sentiment: data.sentiment,
        suggestions: data.suggestions
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I'm having trouble responding right now. Please try again or contact your therapist if you need immediate support.",
        sender: 'ai',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const sendSuggestion = (suggestion: string) => {
    setInputValue(suggestion)
  }

  const getCrisisLevelColor = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'HIGH':
        return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'MEDIUM':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'LOW':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      default:
        return 'text-green-600 bg-green-50 border-green-200'
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <div className="bg-gradient-therapy p-3 rounded-2xl">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold">AI Support Chat</h1>
        </div>
        <p className="text-muted-foreground">
          Safe, confidential support available 24/7
        </p>
      </div>

      {/* Crisis Alert */}
      <AnimatePresence>
        {showCrisisAlert && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-50 border border-red-200 rounded-2xl p-6"
          >
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-red-600 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-800 mb-2">
                  Crisis Support Available
                </h3>
                <p className="text-red-700 mb-4">
                  I've detected that you may be going through a difficult time. While I'm here to support you, 
                  please consider reaching out to a human professional for immediate help.
                </p>
                <div className="grid md:grid-cols-3 gap-3">
                  {crisisResources.map((resource) => (
                    <div key={resource.name} className="bg-white p-3 rounded-xl border">
                      <h4 className="font-medium text-sm">{resource.name}</h4>
                      <p className="text-red-600 font-semibold">{resource.phone}</p>
                      <p className="text-xs text-muted-foreground">{resource.available}</p>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCrisisAlert(false)}
                  className="mt-4"
                >
                  I understand
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Interface */}
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Conversation
          </CardTitle>
          <CardDescription>
            Your conversation is private and secure
          </CardDescription>
        </CardHeader>

        {/* Messages */}
        <CardContent className="flex-1 overflow-y-auto p-0">
          <div className="p-4 space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.sender === 'ai' && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback className="bg-gradient-therapy text-white">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div className={`max-w-[80%] space-y-2 ${
                  message.sender === 'user' ? 'items-end' : 'items-start'
                }`}>
                  <div className={`p-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground ml-12'
                      : 'bg-muted mr-12'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                  
                  {/* Sentiment Analysis for AI messages */}
                  {message.sender === 'ai' && message.sentiment && (
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div className="flex items-center gap-2">
                        <span>Detected mood:</span>
                        <span className={`px-2 py-1 rounded-full border ${
                          getCrisisLevelColor(message.sentiment.crisisLevel)
                        }`}>
                          {message.sentiment.sentiment}
                        </span>
                      </div>
                      {message.sentiment.emotions.length > 0 && (
                        <div>
                          <span>Emotions: {message.sentiment.emotions.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Suggestions */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Lightbulb className="h-3 w-3" />
                        <span>Helpful suggestions:</span>
                      </div>
                      <div className="space-y-1">
                        {message.suggestions.map((suggestion, index) => (
                          <div key={index} className="flex items-start gap-2 text-xs">
                            <CheckCircle className="h-3 w-3 text-green-600 mt-0.5" />
                            <span className="text-muted-foreground">{suggestion}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="text-xs text-muted-foreground">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>

                {message.sender === 'user' && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback className="bg-gradient-wellness text-white">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </motion.div>
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gradient-therapy text-white">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted p-3 rounded-2xl">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </CardContent>

        {/* Quick suggestions from last AI message */}
        {messages.length > 0 && 
         messages[messages.length - 1].sender === 'ai' && 
         messages[messages.length - 1].suggestions && (
          <div className="border-t p-4">
            <p className="text-xs text-muted-foreground mb-2">Quick responses:</p>
            <div className="flex flex-wrap gap-2">
              {messages[messages.length - 1].suggestions!.slice(0, 3).map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => sendSuggestion(suggestion)}
                  className="text-xs"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here... (Press Enter to send)"
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              disabled={!inputValue.trim() || isLoading}
              variant="therapy"
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            This AI assistant provides support but doesn't replace professional therapy. 
            In crisis situations, please contact emergency services.
          </p>
        </div>
      </Card>
    </div>
  )
}
