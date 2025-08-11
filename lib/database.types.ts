export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          role: 'ADMIN' | 'THERAPIST' | 'CLIENT' | 'COUPLE_PARTNER_1' | 'COUPLE_PARTNER_2'
          is_demo: boolean
          first_name: string | null
          last_name: string | null
          name: string | null
          phone: string | null
          date_of_birth: string | null
          timezone: string
          bio: string | null
          last_login_at: string | null
          is_active: boolean
          encryption_key: string | null
          emergency_contact: string | null
          medical_history: string | null
          therapy_goals: string | null
          couple_id: string | null
          couple_partner_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          role?: 'ADMIN' | 'THERAPIST' | 'CLIENT' | 'COUPLE_PARTNER_1' | 'COUPLE_PARTNER_2'
          is_demo?: boolean
          first_name?: string | null
          last_name?: string | null
          name?: string | null
          phone?: string | null
          date_of_birth?: string | null
          timezone?: string
          bio?: string | null
          last_login_at?: string | null
          is_active?: boolean
          encryption_key?: string | null
          emergency_contact?: string | null
          medical_history?: string | null
          therapy_goals?: string | null
          couple_id?: string | null
          couple_partner_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'ADMIN' | 'THERAPIST' | 'CLIENT' | 'COUPLE_PARTNER_1' | 'COUPLE_PARTNER_2'
          is_demo?: boolean
          first_name?: string | null
          last_name?: string | null
          name?: string | null
          phone?: string | null
          date_of_birth?: string | null
          timezone?: string
          bio?: string | null
          last_login_at?: string | null
          is_active?: boolean
          encryption_key?: string | null
          emergency_contact?: string | null
          medical_history?: string | null
          therapy_goals?: string | null
          couple_id?: string | null
          couple_partner_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_couple_partner_id_fkey"
            columns: ["couple_partner_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          }
        ]
      }
      therapist_profiles: {
        Row: {
          id: string
          user_id: string
          license_number: string | null
          specialty: string[]
          years_experience: number | null
          education: string | null
          certifications: string[]
          languages: string[]
          hourly_rate: number | null
          available_hours: Json | null
          practice_address: string | null
          practice_phone: string | null
          practice_website: string | null
          is_verified: boolean
          is_accepting_clients: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          license_number?: string | null
          specialty?: string[]
          years_experience?: number | null
          education?: string | null
          certifications?: string[]
          languages?: string[]
          hourly_rate?: number | null
          available_hours?: Json | null
          practice_address?: string | null
          practice_phone?: string | null
          practice_website?: string | null
          is_verified?: boolean
          is_accepting_clients?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          license_number?: string | null
          specialty?: string[]
          years_experience?: number | null
          education?: string | null
          certifications?: string[]
          languages?: string[]
          hourly_rate?: number | null
          available_hours?: Json | null
          practice_address?: string | null
          practice_phone?: string | null
          practice_website?: string | null
          is_verified?: boolean
          is_accepting_clients?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "therapist_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      couples: {
        Row: {
          id: string
          partner1_id: string
          partner2_id: string
          relationship_start: string | null
          therapy_goals: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          partner1_id: string
          partner2_id: string
          relationship_start?: string | null
          therapy_goals?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          partner1_id?: string
          partner2_id?: string
          relationship_start?: string | null
          therapy_goals?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "couples_partner1_id_fkey"
            columns: ["partner1_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "couples_partner2_id_fkey"
            columns: ["partner2_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      therapy_sessions: {
        Row: {
          id: string
          title: string
          description: string | null
          type: 'INDIVIDUAL' | 'COUPLE' | 'GROUP'
          status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
          start_time: string
          end_time: string
          timezone: string
          client_id: string
          therapist_id: string
          couple_id: string | null
          partner_id: string | null
          notes: string | null
          ai_summary: string | null
          recording: string | null
          meeting_room: string | null
          meeting_link: string | null
          cost: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          type: 'INDIVIDUAL' | 'COUPLE' | 'GROUP'
          status?: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
          start_time: string
          end_time: string
          timezone?: string
          client_id: string
          therapist_id: string
          couple_id?: string | null
          partner_id?: string | null
          notes?: string | null
          ai_summary?: string | null
          recording?: string | null
          meeting_room?: string | null
          meeting_link?: string | null
          cost?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          type?: 'INDIVIDUAL' | 'COUPLE' | 'GROUP'
          status?: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
          start_time?: string
          end_time?: string
          timezone?: string
          client_id?: string
          therapist_id?: string
          couple_id?: string | null
          partner_id?: string | null
          notes?: string | null
          ai_summary?: string | null
          recording?: string | null
          meeting_room?: string | null
          meeting_link?: string | null
          cost?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "therapy_sessions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "therapy_sessions_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "therapy_sessions_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "therapy_sessions_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      ai_conversations: {
        Row: {
          id: string
          user_id: string
          title: string | null
          context: string | null
          sentiment: string | null
          crisis_level: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
          model: string
          system_prompt: string | null
          is_escalated: boolean
          escalated_at: string | null
          escalation_reason: string | null
          summary: string | null
          key_insights: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: string | null
          context?: string | null
          sentiment?: string | null
          crisis_level?: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
          model?: string
          system_prompt?: string | null
          is_escalated?: boolean
          escalated_at?: string | null
          escalation_reason?: string | null
          summary?: string | null
          key_insights?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string | null
          context?: string | null
          sentiment?: string | null
          crisis_level?: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
          model?: string
          system_prompt?: string | null
          is_escalated?: boolean
          escalated_at?: string | null
          escalation_reason?: string | null
          summary?: string | null
          key_insights?: string[]
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      messages: {
        Row: {
          id: string
          content: string
          type: 'TEXT' | 'IMAGE' | 'FILE' | 'SYSTEM'
          is_encrypted: boolean
          sender_id: string
          receiver_id: string | null
          session_id: string | null
          ai_conversation_id: string | null
          metadata: Json | null
          read_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          content: string
          type?: 'TEXT' | 'IMAGE' | 'FILE' | 'SYSTEM'
          is_encrypted?: boolean
          sender_id: string
          receiver_id?: string | null
          session_id?: string | null
          ai_conversation_id?: string | null
          metadata?: Json | null
          read_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          content?: string
          type?: 'TEXT' | 'IMAGE' | 'FILE' | 'SYSTEM'
          is_encrypted?: boolean
          sender_id?: string
          receiver_id?: string | null
          session_id?: string | null
          ai_conversation_id?: string | null
          metadata?: Json | null
          read_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "therapy_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_ai_conversation_id_fkey"
            columns: ["ai_conversation_id"]
            isOneToOne: false
            referencedRelation: "ai_conversations"
            referencedColumns: ["id"]
          }
        ]
      }
      content_categories: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          color: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon?: string | null
          color?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon?: string | null
          color?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      content: {
        Row: {
          id: string
          title: string
          description: string | null
          content: string
          type: string
          category_id: string
          tags: string[]
          thumbnail_url: string | null
          media_url: string | null
          duration: number | null
          target_audience: string[]
          difficulty_level: string | null
          author: string | null
          is_published: boolean
          views: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          content: string
          type: string
          category_id: string
          tags?: string[]
          thumbnail_url?: string | null
          media_url?: string | null
          duration?: number | null
          target_audience?: string[]
          difficulty_level?: string | null
          author?: string | null
          is_published?: boolean
          views?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          content?: string
          type?: string
          category_id?: string
          tags?: string[]
          thumbnail_url?: string | null
          media_url?: string | null
          duration?: number | null
          target_audience?: string[]
          difficulty_level?: string | null
          author?: string | null
          is_published?: boolean
          views?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "content_categories"
            referencedColumns: ["id"]
          }
        ]
      }
      payments: {
        Row: {
          id: string
          amount: number
          currency: string
          status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
          stripe_payment_id: string | null
          stripe_customer_id: string | null
          payer_id: string
          session_id: string | null
          is_split_payment: boolean
          split_percentage: number | null
          description: string | null
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          amount: number
          currency?: string
          status?: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
          stripe_payment_id?: string | null
          stripe_customer_id?: string | null
          payer_id: string
          session_id?: string | null
          is_split_payment?: boolean
          split_percentage?: number | null
          description?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          amount?: number
          currency?: string
          status?: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
          stripe_payment_id?: string | null
          stripe_customer_id?: string | null
          payer_id?: string
          session_id?: string | null
          is_split_payment?: boolean
          split_percentage?: number | null
          description?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_payer_id_fkey"
            columns: ["payer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "therapy_sessions"
            referencedColumns: ["id"]
          }
        ]
      }
      system_logs: {
        Row: {
          id: string
          level: string
          message: string
          context: Json | null
          user_id: string | null
          session_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          level: string
          message: string
          context?: Json | null
          user_id?: string | null
          session_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          level?: string
          message?: string
          context?: Json | null
          user_id?: string | null
          session_id?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "system_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "system_logs_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "therapy_sessions"
            referencedColumns: ["id"]
          }
        ]
      }

      client_therapist_assignments: {
  Row: {
    id: string
    client_id: string
    therapist_id: string
    assigned_at: string // ISO date string
    status: 'ACTIVE' | 'INACTIVE'
    created_at: string
    updated_at: string
  }
  Insert: {
    id?: string
    client_id: string
    therapist_id: string
    assigned_at?: string
    status?: 'ACTIVE' | 'INACTIVE'
    created_at?: string
    updated_at?: string
  }
  Update: {
    id?: string
    client_id?: string
    therapist_id?: string
    assigned_at?: string
    status?: 'ACTIVE' | 'INACTIVE'
    created_at?: string
    updated_at?: string
  }
  Relationships: [
    {
      foreignKeyName: "client_therapist_assignments_client_id_fkey"
      columns: ["client_id"]
      isOneToOne: false
      referencedRelation: "users"
      referencedColumns: ["id"]
    },
    {
      foreignKeyName: "client_therapist_assignments_therapist_id_fkey"
      columns: ["therapist_id"]
      isOneToOne: false
      referencedRelation: "users"
      referencedColumns: ["id"]
    }
  ]
}

    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'ADMIN' | 'THERAPIST' | 'CLIENT' | 'COUPLE_PARTNER_1' | 'COUPLE_PARTNER_2'
      session_type: 'INDIVIDUAL' | 'COUPLE' | 'GROUP'
      session_status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
      payment_status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
      message_type: 'TEXT' | 'IMAGE' | 'FILE' | 'SYSTEM'
      crisis_level: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
