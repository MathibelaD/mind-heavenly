'use client'

import { useSupabase } from '../../../contexts/SupabaseProvider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Sidebar } from '../../../components/layout/sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useSupabase()
  const router = useRouter()

  useEffect(() => {
    if (loading) return // Still loading

    if (!user) {
      router.push('/auth/signin')
      return
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Sidebar />
      <div className="md:pl-64">
        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
