'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, 
  Calendar, 
  MessageCircle, 
  Users, 
  BookOpen, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Brain,
  Heart,
  Sparkles,
  BarChart3,
  CreditCard,
  User,
  Video
} from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import { cn } from '../../lib/utils'
import { UserRole } from '../../lib/auth'
import { useAuth } from '../../lib/hooks/useAuth'

interface NavigationItem {
  name: string
  href: string
  icon: any
  roles: UserRole[]
}

const navigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: Home, roles: ['THERAPIST', 'CLIENT', 'COUPLE_PARTNER_1', 'COUPLE_PARTNER_2'] },
  { name: 'Calendar', href: '/dashboard/calendar', icon: Calendar, roles: ['THERAPIST', 'CLIENT', 'COUPLE_PARTNER_1', 'COUPLE_PARTNER_2'] },
  { name: 'Sessions', href: '/dashboard/sessions', icon: Video, roles: ['THERAPIST', 'CLIENT', 'COUPLE_PARTNER_1', 'COUPLE_PARTNER_2'] },
  { name: 'Messages', href: '/dashboard/messages', icon: MessageCircle, roles: ['THERAPIST', 'CLIENT', 'COUPLE_PARTNER_1', 'COUPLE_PARTNER_2'] },
  { name: 'AI Support', href: '/dashboard/ai-chat', icon: Brain, roles: ['CLIENT', 'COUPLE_PARTNER_1', 'COUPLE_PARTNER_2'] },
  { name: 'Clients', href: '/dashboard/clients', icon: Users, roles: ['THERAPIST'] },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3, roles: ['THERAPIST'] },
  { name: 'Resources', href: '/dashboard/resources', icon: BookOpen, roles: ['THERAPIST', 'CLIENT', 'COUPLE_PARTNER_1', 'COUPLE_PARTNER_2'] },
  { name: 'Billing', href: '/dashboard/billing', icon: CreditCard, roles: ['THERAPIST', 'CLIENT', 'COUPLE_PARTNER_1', 'COUPLE_PARTNER_2'] },
  { name: 'Profile', href: '/dashboard/profile', icon: User, roles: ['THERAPIST', 'CLIENT', 'COUPLE_PARTNER_1', 'COUPLE_PARTNER_2'] },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings, roles: ['THERAPIST', 'CLIENT', 'COUPLE_PARTNER_1', 'COUPLE_PARTNER_2'] },
]

export function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading, signOut } = useAuth()

  if (loading) {
    return (
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-white border-r">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const userRole = user.role
  const userName = user.name || 
                   (user.firstName && user.lastName 
                     ? `${user.firstName} ${user.lastName}` 
                     : user.firstName || user.email?.split('@')[0] || 'User')
  const userEmail = user.email || ''
  const isDemo = user.isDemo

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'THERAPIST':
        return <Brain className="h-4 w-4" />
      case 'CLIENT':
        return <Heart className="h-4 w-4" />
      case 'COUPLE_PARTNER_1':
      case 'COUPLE_PARTNER_2':
        return <Sparkles className="h-4 w-4" />
      case 'ADMIN':
        return <User className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getRoleDisplay = (role: UserRole) => {
    switch (role) {
      case 'THERAPIST':
        return 'Therapist'
      case 'CLIENT':
        return 'Client'
      case 'COUPLE_PARTNER_1':
        return 'Partner 1'
      case 'COUPLE_PARTNER_2':
        return 'Partner 2'
      case 'ADMIN':
        return 'Administrator'
      default:
        return 'User'
    }
  }

  const filteredNavigation = navigation.filter(item => 
    userRole && item.roles.includes(userRole)
  )

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setIsSigningOut(false)
    }
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-xl">
          <Brain className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-display font-bold text-xl bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Mind Heavenly
          </h1>
          {isDemo && (
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full mt-1 inline-block">
              Demo Mode
            </span>
          )}
        </div>
      </div>

      {/* User Profile */}
      <div className="px-6 py-4 border-b">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="" alt={userName} />
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              {getInitials(userName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate" title={userName}>
              {userName}
            </p>
            <div className="flex items-center gap-2">
              {getRoleIcon(userRole)}
              <p className="text-xs text-muted-foreground">
                {getRoleDisplay(userRole)}
              </p>
            </div>
            {userEmail && (
              <p className="text-xs text-muted-foreground truncate" title={userEmail}>
                {userEmail}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {filteredNavigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || 
            (item.href !== '/dashboard' && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Sign Out */}
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
          onClick={handleSignOut}
          disabled={isSigningOut}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">
            {isSigningOut ? 'Signing out...' : 'Sign Out'}
          </span>
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-white border-r">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Sidebar */}
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-64 bg-white border-r z-50 md:hidden"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}