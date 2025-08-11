// Match your database enums
export type UserRole = 
  | "ADMIN" 
  | "THERAPIST" 
  | "CLIENT" 
  | "COUPLE_PARTNER_1" 
  | "COUPLE_PARTNER_2"

export type SessionType = "INDIVIDUAL" | "COUPLE" | "GROUP"
export type SessionStatus = "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "NO_SHOW"
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED"
export type MessageType = "TEXT" | "IMAGE" | "FILE" | "SYSTEM"
export type CrisisLevel = "NONE" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"

// User type matching your users table
export interface CustomUser {
  id: string
  email: string
  role: UserRole
  is_demo: boolean
  first_name?: string
  last_name?: string
  name?: string
  phone?: string
  date_of_birth?: string
  timezone: string
  bio?: string
  last_login_at?: string
  is_active: boolean
  encryption_key?: string
  emergency_contact?: string
  medical_history?: string
  therapy_goals?: string
  couple_id?: string
  couple_partner_id?: string
  created_at: string
  updated_at: string
}

// Additional types for related tables
export interface TherapistProfile {
  id: string
  user_id: string
  license_number?: string
  specialty: string[]
  years_experience?: number
  education?: string
  certifications: string[]
  languages: string[]
  hourly_rate?: number
  available_hours?: any
  practice_address?: string
  practice_phone?: string
  practice_website?: string
  is_verified: boolean
  is_accepting_clients: boolean
  created_at: string
  updated_at: string
}

export interface Couple {
  id: string
  partner1_id: string
  partner2_id: string
  relationship_start?: string
  therapy_goals?: string
  created_at: string
  updated_at: string
}