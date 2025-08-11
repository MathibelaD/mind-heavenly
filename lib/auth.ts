import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from './database.types'

export type UserRole = 'ADMIN' | 'THERAPIST' | 'CLIENT' | 'COUPLE_PARTNER_1' | 'COUPLE_PARTNER_2'

export interface User {
  id: string
  email: string
  role: UserRole
  isDemo: boolean
  name?: string
  firstName?: string
  lastName?: string
}

export async function createServerSupabaseClient() {
  const cookieStore = cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

export async function getUser(): Promise<User | null> {
  const supabase = await createServerSupabaseClient()
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session?.user) {
    return null
  }

  const { data: userData, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.user.id)
    .single()

  if (error || !userData) {
    return null
  }

  return {
    id: userData.id,
    email: userData.email,
    role: userData.role,
    isDemo: userData.is_demo,
    name: userData.name || undefined,
    firstName: userData.first_name || undefined,
    lastName: userData.last_name || undefined
  }
}

export async function signInWithPassword(email: string, password: string) {
  const supabase = await createServerSupabaseClient()
  
  return await supabase.auth.signInWithPassword({
    email,
    password
  })
}

export async function signOut() {
  const supabase = await createServerSupabaseClient()
  
  return await supabase.auth.signOut()
}
