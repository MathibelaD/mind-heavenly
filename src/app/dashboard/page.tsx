'use client'

import { useSupabase } from '@/contexts/SupabaseProvider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardPage() {
  const { user } = useSupabase()
  const router = useRouter()

  useEffect(() => {
    if (user?.role) {
      const role = user.role
      switch (role) {
        case 'THERAPIST':
          router.push('/dashboard/therapist')
          break
        case 'CLIENT':
          router.push('/dashboard/client')
          break
        case 'COUPLE_PARTNER_1':
        case 'COUPLE_PARTNER_2':
          router.push('/dashboard/couple')
          break
        default:
          break
      }
    }
  }, [user, router])

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
    </div>
  )
}
