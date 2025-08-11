import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import type { Session, User } from '@supabase/supabase-js'
import { UserRole } from '../auth'
import { Database } from '../database.types'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Create the same supabase client as your provider
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('Session error:', sessionError)
          setError(sessionError.message)
          setLoading(false)
          return
        }

        setSession(session)

        if (session?.user) {
          console.log('useAuth: fetching user profile for', session.user.id)
          
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (userError) {
            // If user doesn't exist, create them
            if (userError.code === 'PGRST116') {
              console.log('useAuth: creating new user')
              
              const newUser = {
                id: session.user.id,
                email: session.user.email!,
                role: 'CLIENT' as UserRole,
                is_demo: false,
                name: session.user.user_metadata?.full_name || 
                      session.user.user_metadata?.name || null,
                first_name: session.user.user_metadata?.first_name || null,
                last_name: session.user.user_metadata?.last_name || null,
                timezone: 'UTC',
                is_active: true
              }

              const { data: createdUser, error: createError } = await supabase
                .from('users')
                .insert([newUser])
                .select()
                .single()

              if (createError) {
                console.error('Error creating user:', createError)
                setError('Failed to create user profile')
                setLoading(false)
                return
              }

              console.log('useAuth: user created successfully')
              setUser({
                id: createdUser.id,
                email: createdUser.email,
                role: createdUser.role,
                isDemo: createdUser.is_demo,
                name: createdUser.name || undefined,
                firstName: createdUser.first_name || undefined,
                lastName: createdUser.last_name || undefined
              })
            } else {
              console.error('Error fetching user:', userError)
              setError('Failed to fetch user profile')
            }
          } else {
            console.log('useAuth: user found, setting profile')
            setUser({
              id: userData.id,
              email: userData.email,
              role: userData.role,
              isDemo: userData.is_demo,
              name: userData.name || undefined,
              firstName: userData.first_name || undefined,
              lastName: userData.last_name || undefined
            })

            // Update last login
            await supabase
              .from('users')
              .update({ last_login_at: new Date().toISOString() })
              .eq('id', session.user.id)
          }
        } else {
          console.log('useAuth: no session user')
          setUser(null)
        }
      } catch (err) {
        console.error('useAuth: unexpected error:', err)
        setError('An unexpected error occurred')
      } finally {
        setLoading(false)
      }
    }

    getUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('useAuth: auth state changed', { event, hasSession: !!session })
        
        setSession(session)

        if (session?.user) {
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (userData) {
            setUser({
              id: userData.id,
              email: userData.email,
              role: userData.role,
              isDemo: userData.is_demo,
              name: userData.name || undefined,
              firstName: userData.first_name || undefined,
              lastName: userData.last_name || undefined
            })

            // Update last login
            await supabase
              .from('users')
              .update({ last_login_at: new Date().toISOString() })
              .eq('id', session.user.id)
          }
        } else {
          setUser(null)
        }

        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const updateProfile = async (updates: Partial<User>) => {
    if (!user || !session) return null

    try {
      // Map the User interface back to database columns
      const dbUpdates: any = {}
      if (updates.name !== undefined) dbUpdates.name = updates.name
      if (updates.firstName !== undefined) dbUpdates.first_name = updates.firstName
      if (updates.lastName !== undefined) dbUpdates.last_name = updates.lastName
      if (updates.role !== undefined) dbUpdates.role = updates.role

      const { data, error } = await supabase
        .from('users')
        .update(dbUpdates)
        .eq('id', user.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating profile:', error)
        return null
      }

      // Update local state
      setUser({
        id: data.id,
        email: data.email,
        role: data.role,
        isDemo: data.is_demo,
        name: data.name || undefined,
        firstName: data.first_name || undefined,
        lastName: data.last_name || undefined
      })

      return data
    } catch (error) {
      console.error('Unexpected error updating profile:', error)
      return null
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  console.log('useAuth: current state', { 
    hasUser: !!user, 
    hasSession: !!session,
    loading, 
    error,
    userRole: user?.role
  })

  return {
    user,
    session,
    loading,
    error,
    isAuthenticated: !!user && !!session,
    updateProfile,
    signOut,
    supabase,
    // Helper functions
    isTherapist: user?.role === 'THERAPIST',
    isClient: user?.role === 'CLIENT',
    isCouplePartner: user?.role === 'COUPLE_PARTNER_1' || user?.role === 'COUPLE_PARTNER_2',
    isAdmin: user?.role === 'ADMIN',
    isDemo: user?.isDemo || false
  }
}