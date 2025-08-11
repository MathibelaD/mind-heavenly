'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Brain, 
  Heart, 
  Play, 
  Pause,
  Clock, 
  Star,
  Search,
  Filter,
  Bookmark,
  BookmarkCheck,
  Volume2,
  FileText,
  Zap,
  TrendingUp,
  Target,
  User,
  Users
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface ContentItem {
  id: string
  title: string
  description: string
  type: 'article' | 'meditation' | 'exercise' | 'video' | 'audio'
  category: {
    id: string
    name: string
    color: string
    icon: string
  }
  content: string
  thumbnailUrl?: string
  mediaUrl?: string
  duration?: number // in seconds
  targetAudience: string[]
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced'
  author: string
  tags: string[]
  views: number
  rating: number
  isPersonalized: boolean
  isFavorited: boolean
  progress?: number // percentage completed
  estimatedReadTime?: number // in minutes
}

const categories = [
  { id: 'anxiety', name: 'Anxiety Management', color: 'bg-blue-100 text-blue-600', icon: 'brain' },
  { id: 'relationships', name: 'Relationship Health', color: 'bg-red-100 text-red-600', icon: 'heart' },
  { id: 'mindfulness', name: 'Mindfulness & Meditation', color: 'bg-green-100 text-green-600', icon: 'flower' },
  { id: 'depression', name: 'Depression Support', color: 'bg-purple-100 text-purple-600', icon: 'cloud' },
  { id: 'stress', name: 'Stress Management', color: 'bg-yellow-100 text-yellow-600', icon: 'lightning' },
  { id: 'communication', name: 'Communication Skills', color: 'bg-teal-100 text-teal-600', icon: 'message' }
]

// Mock content data
const mockContent: ContentItem[] = [
  {
    id: '1',
    title: '5-Minute Breathing Exercise',
    description: 'A quick breathing exercise to reduce anxiety and stress',
    type: 'meditation',
    category: { id: 'anxiety', name: 'Anxiety Management', color: 'bg-blue-100 text-blue-600', icon: 'brain' },
    content: 'Find a comfortable position and focus on your breath. Inhale for 4 counts, hold for 4, exhale for 6. Repeat for 5 minutes.',
    duration: 300,
    targetAudience: ['individual', 'couple'],
    difficultyLevel: 'beginner',
    author: 'Dr. Sarah Johnson',
    tags: ['breathing', 'quick', 'anxiety'],
    views: 1542,
    rating: 4.8,
    isPersonalized: true,
    isFavorited: false,
    progress: 0
  },
  {
    id: '2',
    title: 'Effective Communication Techniques',
    description: 'Learn how to communicate more effectively with your partner',
    type: 'article',
    category: { id: 'communication', name: 'Communication Skills', color: 'bg-teal-100 text-teal-600', icon: 'message' },
    content: 'Effective communication involves active listening, using "I" statements, and avoiding defensive responses...',
    targetAudience: ['couple'],
    difficultyLevel: 'intermediate',
    author: 'Dr. Sarah Johnson',
    tags: ['communication', 'couples', 'conflict resolution'],
    views: 892,
    rating: 4.6,
    isPersonalized: false,
    isFavorited: true,
    estimatedReadTime: 12,
    progress: 75
  },
  {
    id: '3',
    title: 'Progressive Muscle Relaxation',
    description: 'Full body relaxation technique for stress relief',
    type: 'meditation',
    category: { id: 'stress', name: 'Stress Management', color: 'bg-yellow-100 text-yellow-600', icon: 'lightning' },
    content: 'Progressive muscle relaxation involves tensing and releasing different muscle groups...',
    duration: 1200,
    targetAudience: ['individual', 'couple'],
    difficultyLevel: 'beginner',
    author: 'Dr. Sarah Johnson',
    tags: ['relaxation', 'stress relief', 'body awareness'],
    views: 756,
    rating: 4.9,
    isPersonalized: true,
    isFavorited: false,
    progress: 0
  },
  {
    id: '4',
    title: 'Understanding Anxiety Triggers',
    description: 'Identify and understand your personal anxiety triggers',
    type: 'article',
    category: { id: 'anxiety', name: 'Anxiety Management', color: 'bg-blue-100 text-blue-600', icon: 'brain' },
    content: 'Anxiety triggers are specific situations, thoughts, or feelings that activate your anxiety response...',
    targetAudience: ['individual'],
    difficultyLevel: 'intermediate',
    author: 'Dr. Michael Chen',
    tags: ['anxiety', 'self-awareness', 'triggers'],
    views: 1203,
    rating: 4.7,
    isPersonalized: true,
    isFavorited: false,
    estimatedReadTime: 8,
    progress: 0
  },
  {
    id: '5',
    title: 'Mindful Walking Exercise',
    description: 'Practice mindfulness while walking to center yourself',
    type: 'exercise',
    category: { id: 'mindfulness', name: 'Mindfulness & Meditation', color: 'bg-green-100 text-green-600', icon: 'flower' },
    content: 'Mindful walking combines physical movement with meditation...',
    duration: 900,
    targetAudience: ['individual', 'couple'],
    difficultyLevel: 'beginner',
    author: 'Dr. Sarah Johnson',
    tags: ['mindfulness', 'movement', 'grounding'],
    views: 643,
    rating: 4.5,
    isPersonalized: false,
    isFavorited: false,
    progress: 0
  }
]

export default function ResourcesPage() {
  const { data: session } = useSession()
  const [content, setContent] = useState<ContentItem[]>(mockContent)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playingId, setPlayingId] = useState<string | null>(null)

  const userRole = session?.user?.role
  const isCouple = userRole === 'COUPLE_PARTNER_1' || userRole === 'COUPLE_PARTNER_2'

  const personalizedContent = content.filter(item => item.isPersonalized)
  const favoriteContent = content.filter(item => item.isFavorited)

  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || item.category.id === selectedCategory
    const matchesType = selectedType === 'all' || item.type === selectedType
    
    // Filter by target audience
    const matchesAudience = item.targetAudience.includes('individual') ||
                           (isCouple && item.targetAudience.includes('couple'))
    
    return matchesSearch && matchesCategory && matchesType && matchesAudience
  })

  const toggleFavorite = (id: string) => {
    setContent(prev => prev.map(item => 
      item.id === id ? { ...item, isFavorited: !item.isFavorited } : item
    ))
  }

  const updateProgress = (id: string, progress: number) => {
    setContent(prev => prev.map(item => 
      item.id === id ? { ...item, progress } : item
    ))
  }

  const playContent = (id: string) => {
    setPlayingId(id)
    setIsPlaying(true)
    // In a real app, this would start audio/video playback
  }

  const pauseContent = () => {
    setIsPlaying(false)
    setPlayingId(null)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article':
        return <FileText className="h-4 w-4" />
      case 'meditation':
        return <Brain className="h-4 w-4" />
      case 'exercise':
        return <Zap className="h-4 w-4" />
      case 'video':
        return <Play className="h-4 w-4" />
      case 'audio':
        return <Volume2 className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'text-green-600 bg-green-50'
      case 'intermediate':
        return 'text-yellow-600 bg-yellow-50'
      case 'advanced':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const ContentCard = ({ item }: { item: ContentItem }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group"
    >
      <Card className="card-hover cursor-pointer h-full">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-2 rounded-xl ${item.category.color}`}>
              {getTypeIcon(item.type)}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                toggleFavorite(item.id)
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {item.isFavorited ? (
                <BookmarkCheck className="h-4 w-4 text-primary" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="space-y-3">
            <div>
              <h3 className="font-semibold mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {item.description}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className={`px-2 py-1 rounded-full ${getDifficultyColor(item.difficultyLevel)}`}>
                {item.difficultyLevel}
              </span>
              <span className="text-muted-foreground">by {item.author}</span>
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-4">
                {item.duration && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatDuration(item.duration)}</span>
                  </div>
                )}
                {item.estimatedReadTime && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{item.estimatedReadTime} min read</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current text-yellow-500" />
                  <span>{item.rating}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                <span>{item.views}</span>
              </div>
            </div>

            {item.progress !== undefined && item.progress > 0 && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Progress</span>
                  <span>{item.progress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1">
                  <div 
                    className="bg-primary h-1 rounded-full transition-all"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              {(item.type === 'meditation' || item.type === 'audio') && (
                <Button
                  size="sm"
                  variant={playingId === item.id && isPlaying ? "default" : "outline"}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (playingId === item.id && isPlaying) {
                      pauseContent()
                    } else {
                      playContent(item.id)
                    }
                  }}
                  className="gap-2"
                >
                  {playingId === item.id && isPlaying ? (
                    <Pause className="h-3 w-3" />
                  ) : (
                    <Play className="h-3 w-3" />
                  )}
                  {playingId === item.id && isPlaying ? 'Pause' : 'Play'}
                </Button>
              )}
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedContent(item)}
                className="flex-1"
              >
                {item.type === 'article' ? 'Read' : 'Start'}
              </Button>
            </div>

            {item.isPersonalized && (
              <div className="flex items-center gap-1 text-xs text-primary">
                <Target className="h-3 w-3" />
                <span>Personalized for you</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  const ContentDetailDialog = () => (
    <Dialog open={!!selectedContent} onOpenChange={() => setSelectedContent(null)}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        {selectedContent && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${selectedContent.category.color}`}>
                  {getTypeIcon(selectedContent.type)}
                </div>
                {selectedContent.title}
              </DialogTitle>
              <DialogDescription>
                <div className="flex items-center gap-4 text-sm">
                  <span>by {selectedContent.author}</span>
                  <span>•</span>
                  <span className={`px-2 py-1 rounded-full ${getDifficultyColor(selectedContent.difficultyLevel)}`}>
                    {selectedContent.difficultyLevel}
                  </span>
                  {selectedContent.duration && (
                    <>
                      <span>•</span>
                      <span>{formatDuration(selectedContent.duration)}</span>
                    </>
                  )}
                  {selectedContent.estimatedReadTime && (
                    <>
                      <span>•</span>
                      <span>{selectedContent.estimatedReadTime} min read</span>
                    </>
                  )}
                </div>
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <p className="text-muted-foreground">{selectedContent.description}</p>
              
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap">{selectedContent.content}</div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex gap-2">
                  {selectedContent.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-muted rounded-full text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleFavorite(selectedContent.id)}
                    className="gap-2"
                  >
                    {selectedContent.isFavorited ? (
                      <BookmarkCheck className="h-4 w-4" />
                    ) : (
                      <Bookmark className="h-4 w-4" />
                    )}
                    {selectedContent.isFavorited ? 'Saved' : 'Save'}
                  </Button>
                  
                  <Button
                    variant="therapy"
                    size="sm"
                    onClick={() => {
                      updateProgress(selectedContent.id, 100)
                      setSelectedContent(null)
                    }}
                  >
                    Mark Complete
                  </Button>
                </div>
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
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-display font-bold">Resource Library</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover curated content designed to support your mental health journey. 
            Articles, meditations, and exercises tailored to your needs.
          </p>
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
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search resources..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('all')}
                >
                  All Categories
                </Button>
                {categories.map(category => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedType === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedType('all')}
                >
                  All Types
                </Button>
                <Button
                  variant={selectedType === 'article' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedType('article')}
                >
                  Articles
                </Button>
                <Button
                  variant={selectedType === 'meditation' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedType('meditation')}
                >
                  Meditations
                </Button>
                <Button
                  variant={selectedType === 'exercise' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedType('exercise')}
                >
                  Exercises
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Personalized Content */}
      {personalizedContent.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Recommended for You
              </CardTitle>
              <CardDescription>
                Personalized content based on your therapy goals and progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {personalizedContent.slice(0, 3).map(item => (
                  <ContentCard key={item.id} item={item} />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Favorites */}
      {favoriteContent.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookmarkCheck className="h-5 w-5" />
                Your Favorites
              </CardTitle>
              <CardDescription>
                Content you've saved for easy access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteContent.map(item => (
                  <ContentCard key={item.id} item={item} />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* All Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              All Resources
            </CardTitle>
            <CardDescription>
              {filteredContent.length} resource{filteredContent.length !== 1 ? 's' : ''} available
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredContent.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredContent.map(item => (
                  <ContentCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No resources found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or filters
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <ContentDetailDialog />
    </div>
  )
}
