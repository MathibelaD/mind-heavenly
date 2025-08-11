'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSupabase } from '../../contexts/SupabaseProvider'
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

interface NavigationItem {
  name: string
  href: string
  icon: any
  roles: string[]
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
  const pathname = usePathname()
  const { user, supabase } = useSupabase()

  const userRole = user?.role
  const userName = user?.name || 'User'
  const userEmail = user?.email || ''
  const isDemo = user?.isDemo

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'THERAPIST':
        return <Brain className="h-4 w-4" />
      case 'CLIENT':
        return <Heart className="h-4 w-4" />
      case 'COUPLE_PARTNER_1':
      case 'COUPLE_PARTNER_2':
        return <Sparkles className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'THERAPIST':
        return 'Therapist'
      case 'CLIENT':
        return 'Client'
      case 'COUPLE_PARTNER_1':
        return 'Partner 1'
      case 'COUPLE_PARTNER_2':
        return 'Partner 2'
      default:
        return 'User'
    }
  }

  const filteredNavigation = navigation.filter(item => 
    userRole && item.roles.includes(userRole)
  )

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b">
        <div className="bg-gradient-therapy p-2 rounded-xl">
          <Brain className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="font-display font-bold text-xl text-gradient">Mind Heavenly</h1>
          {isDemo && (
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
              Demo Mode
            </span>
          )}
        </div>
      </div>

      {/* User Profile */}
      <div className="px-6 py-4 border-b">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={session?.user?.image || ''} />
            <AvatarFallback className="bg-gradient-therapy text-white">
              {getInitials(userName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{userName}</p>
            <div className="flex items-center gap-2">
              {getRoleIcon(userRole || '')}
              <p className="text-xs text-muted-foreground">
                {getRoleDisplay(userRole || '')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {filteredNavigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || 
            (item.href !== '/dashboard' && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Sign Out */}
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
          onClick={() => supabase.auth.signOut()}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
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
              className="fixed inset-y-0 left-0 w-64 bg- border-r z-50 md:hidden"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
