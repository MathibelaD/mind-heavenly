'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { Database } from '../lib/database.types'
import { User, UserRole } from '../lib/auth'
import type { Session } from '@supabase/supabase-js'

type SupabaseContext = {
  supabase: ReturnType<typeof createBrowserClient<Database>>
  user: User | null
  session: Session | null
  loading: boolean
}

const Context = createContext<SupabaseContext | undefined>(undefined)

export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
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
        }
      } else {
        setUser(null)
      }

      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
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
        router.refresh()
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router])

  return (
    <Context.Provider value={{ supabase, user, session, loading }}>
      {children}
    </Context.Provider>
  )
}

export const useSupabase = () => {
  const context = useContext(Context)

  if (context === undefined) {
    throw new Error('useSupabase must be used inside SupabaseProvider')
  }

  return context
}
