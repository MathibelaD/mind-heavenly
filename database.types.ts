export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      ai_conversations: {
        Row: {
          context: string | null
          created_at: string | null
          crisis_level: Database["public"]["Enums"]["crisis_level"] | null
          escalated_at: string | null
          escalation_reason: string | null
          id: string
          is_escalated: boolean | null
          key_insights: string[] | null
          last_message: string | null
          model: string | null
          sentiment: string | null
          summary: string | null
          system_prompt: string | null
          title: string | null
          topic: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          context?: string | null
          created_at?: string | null
          crisis_level?: Database["public"]["Enums"]["crisis_level"] | null
          escalated_at?: string | null
          escalation_reason?: string | null
          id?: string
          is_escalated?: boolean | null
          key_insights?: string[] | null
          last_message?: string | null
          model?: string | null
          sentiment?: string | null
          summary?: string | null
          system_prompt?: string | null
          title?: string | null
          topic?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          context?: string | null
          created_at?: string | null
          crisis_level?: Database["public"]["Enums"]["crisis_level"] | null
          escalated_at?: string | null
          escalation_reason?: string | null
          id?: string
          is_escalated?: boolean | null
          key_insights?: string[] | null
          last_message?: string | null
          model?: string | null
          sentiment?: string | null
          summary?: string | null
          system_prompt?: string | null
          title?: string | null
          topic?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      client_therapist_assignments: {
        Row: {
          assigned_at: string | null
          client_id: string
          created_at: string | null
          id: string
          status: string | null
          therapist_id: string
          updated_at: string | null
        }
        Insert: {
          assigned_at?: string | null
          client_id: string
          created_at?: string | null
          id?: string
          status?: string | null
          therapist_id: string
          updated_at?: string | null
        }
        Update: {
          assigned_at?: string | null
          client_id?: string
          created_at?: string | null
          id?: string
          status?: string | null
          therapist_id?: string
          updated_at?: string | null
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
          },
        ]
      }
      content: {
        Row: {
          author: string | null
          category_id: string
          content: string
          created_at: string | null
          description: string | null
          difficulty_level: string | null
          duration: number | null
          id: string
          is_published: boolean | null
          media_url: string | null
          tags: string[] | null
          target_audience: string[] | null
          thumbnail_url: string | null
          title: string
          type: string
          updated_at: string | null
          views: number | null
        }
        Insert: {
          author?: string | null
          category_id: string
          content: string
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          duration?: number | null
          id?: string
          is_published?: boolean | null
          media_url?: string | null
          tags?: string[] | null
          target_audience?: string[] | null
          thumbnail_url?: string | null
          title: string
          type: string
          updated_at?: string | null
          views?: number | null
        }
        Update: {
          author?: string | null
          category_id?: string
          content?: string
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          duration?: number | null
          id?: string
          is_published?: boolean | null
          media_url?: string | null
          tags?: string[] | null
          target_audience?: string[] | null
          thumbnail_url?: string | null
          title?: string
          type?: string
          updated_at?: string | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "content_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "content_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      content_categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      content_progress: {
        Row: {
          completed: boolean | null
          content_id: string
          created_at: string | null
          id: string
          progress: number | null
          time_spent: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          content_id: string
          created_at?: string | null
          id?: string
          progress?: number | null
          time_spent?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          content_id?: string
          created_at?: string | null
          id?: string
          progress?: number | null
          time_spent?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_progress_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      couples: {
        Row: {
          created_at: string | null
          id: string
          partner1_id: string
          partner2_id: string
          relationship_start: string | null
          therapy_goals: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          partner1_id: string
          partner2_id: string
          relationship_start?: string | null
          therapy_goals?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          partner1_id?: string
          partner2_id?: string
          relationship_start?: string | null
          therapy_goals?: string | null
          updated_at?: string | null
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
          },
        ]
      }
      favorite_content: {
        Row: {
          content_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          content_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          content_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorite_content_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorite_content_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          ai_conversation_id: string | null
          content: string
          created_at: string | null
          id: string
          is_encrypted: boolean | null
          metadata: Json | null
          read_at: string | null
          receiver_id: string | null
          sender_id: string
          session_id: string | null
          type: Database["public"]["Enums"]["message_type"] | null
          updated_at: string | null
        }
        Insert: {
          ai_conversation_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          is_encrypted?: boolean | null
          metadata?: Json | null
          read_at?: string | null
          receiver_id?: string | null
          sender_id: string
          session_id?: string | null
          type?: Database["public"]["Enums"]["message_type"] | null
          updated_at?: string | null
        }
        Update: {
          ai_conversation_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_encrypted?: boolean | null
          metadata?: Json | null
          read_at?: string | null
          receiver_id?: string | null
          sender_id?: string
          session_id?: string | null
          type?: Database["public"]["Enums"]["message_type"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_ai_conversation_id_fkey"
            columns: ["ai_conversation_id"]
            isOneToOne: false
            referencedRelation: "ai_conversations"
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
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
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
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          description: string | null
          id: string
          is_split_payment: boolean | null
          metadata: Json | null
          payer_id: string
          session_id: string | null
          split_percentage: number | null
          status: Database["public"]["Enums"]["payment_status"] | null
          stripe_customer_id: string | null
          stripe_payment_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          is_split_payment?: boolean | null
          metadata?: Json | null
          payer_id: string
          session_id?: string | null
          split_percentage?: number | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          stripe_customer_id?: string | null
          stripe_payment_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          is_split_payment?: boolean | null
          metadata?: Json | null
          payer_id?: string
          session_id?: string | null
          split_percentage?: number | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          stripe_customer_id?: string | null
          stripe_payment_id?: string | null
          updated_at?: string | null
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
          },
        ]
      }
      system_logs: {
        Row: {
          context: Json | null
          created_at: string | null
          id: string
          level: string
          message: string
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          context?: Json | null
          created_at?: string | null
          id?: string
          level: string
          message: string
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          context?: Json | null
          created_at?: string | null
          id?: string
          level?: string
          message?: string
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "system_logs_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "therapy_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "system_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      therapist_profiles: {
        Row: {
          available_hours: Json | null
          certifications: string[] | null
          created_at: string | null
          education: string | null
          hourly_rate: number | null
          id: string
          is_accepting_clients: boolean | null
          is_verified: boolean | null
          languages: string[] | null
          license_number: string | null
          practice_address: string | null
          practice_phone: string | null
          practice_website: string | null
          specialty: string[] | null
          updated_at: string | null
          user_id: string
          years_experience: number | null
        }
        Insert: {
          available_hours?: Json | null
          certifications?: string[] | null
          created_at?: string | null
          education?: string | null
          hourly_rate?: number | null
          id?: string
          is_accepting_clients?: boolean | null
          is_verified?: boolean | null
          languages?: string[] | null
          license_number?: string | null
          practice_address?: string | null
          practice_phone?: string | null
          practice_website?: string | null
          specialty?: string[] | null
          updated_at?: string | null
          user_id: string
          years_experience?: number | null
        }
        Update: {
          available_hours?: Json | null
          certifications?: string[] | null
          created_at?: string | null
          education?: string | null
          hourly_rate?: number | null
          id?: string
          is_accepting_clients?: boolean | null
          is_verified?: boolean | null
          languages?: string[] | null
          license_number?: string | null
          practice_address?: string | null
          practice_phone?: string | null
          practice_website?: string | null
          specialty?: string[] | null
          updated_at?: string | null
          user_id?: string
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "therapist_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      therapy_sessions: {
        Row: {
          ai_summary: string | null
          client_id: string
          cost: number | null
          couple_id: string | null
          created_at: string | null
          description: string | null
          end_time: string
          id: string
          meeting_link: string | null
          meeting_room: string | null
          notes: string | null
          partner_id: string | null
          recording: string | null
          start_time: string
          status: Database["public"]["Enums"]["session_status"] | null
          therapist_id: string
          timezone: string | null
          title: string
          type: Database["public"]["Enums"]["session_type"]
          updated_at: string | null
        }
        Insert: {
          ai_summary?: string | null
          client_id: string
          cost?: number | null
          couple_id?: string | null
          created_at?: string | null
          description?: string | null
          end_time: string
          id?: string
          meeting_link?: string | null
          meeting_room?: string | null
          notes?: string | null
          partner_id?: string | null
          recording?: string | null
          start_time: string
          status?: Database["public"]["Enums"]["session_status"] | null
          therapist_id: string
          timezone?: string | null
          title: string
          type: Database["public"]["Enums"]["session_type"]
          updated_at?: string | null
        }
        Update: {
          ai_summary?: string | null
          client_id?: string
          cost?: number | null
          couple_id?: string | null
          created_at?: string | null
          description?: string | null
          end_time?: string
          id?: string
          meeting_link?: string | null
          meeting_room?: string | null
          notes?: string | null
          partner_id?: string | null
          recording?: string | null
          start_time?: string
          status?: Database["public"]["Enums"]["session_status"] | null
          therapist_id?: string
          timezone?: string | null
          title?: string
          type?: Database["public"]["Enums"]["session_type"]
          updated_at?: string | null
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
          },
          {
            foreignKeyName: "therapy_sessions_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          bio: string | null
          couple_id: string | null
          couple_partner_id: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string
          emergency_contact: string | null
          encryption_key: string | null
          first_name: string | null
          id: string
          is_active: boolean | null
          is_demo: boolean | null
          last_login_at: string | null
          last_name: string | null
          medical_history: string | null
          name: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          therapy_goals: string | null
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          bio?: string | null
          couple_id?: string | null
          couple_partner_id?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email: string
          emergency_contact?: string | null
          encryption_key?: string | null
          first_name?: string | null
          id: string
          is_active?: boolean | null
          is_demo?: boolean | null
          last_login_at?: string | null
          last_name?: string | null
          medical_history?: string | null
          name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          therapy_goals?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          bio?: string | null
          couple_id?: string | null
          couple_partner_id?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string
          emergency_contact?: string | null
          encryption_key?: string | null
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          is_demo?: boolean | null
          last_login_at?: string | null
          last_name?: string | null
          medical_history?: string | null
          name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          therapy_goals?: string | null
          timezone?: string | null
          updated_at?: string | null
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
          },
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
      crisis_level: "NONE" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
      message_type: "TEXT" | "IMAGE" | "FILE" | "SYSTEM"
      payment_status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED"
      session_status:
        | "SCHEDULED"
        | "IN_PROGRESS"
        | "COMPLETED"
        | "CANCELLED"
        | "NO_SHOW"
      session_type: "INDIVIDUAL" | "COUPLE" | "GROUP"
      user_role:
        | "ADMIN"
        | "THERAPIST"
        | "CLIENT"
        | "COUPLE_PARTNER_1"
        | "COUPLE_PARTNER_2"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      crisis_level: ["NONE", "LOW", "MEDIUM", "HIGH", "CRITICAL"],
      message_type: ["TEXT", "IMAGE", "FILE", "SYSTEM"],
      payment_status: ["PENDING", "COMPLETED", "FAILED", "REFUNDED"],
      session_status: [
        "SCHEDULED",
        "IN_PROGRESS",
        "COMPLETED",
        "CANCELLED",
        "NO_SHOW",
      ],
      session_type: ["INDIVIDUAL", "COUPLE", "GROUP"],
      user_role: [
        "ADMIN",
        "THERAPIST",
        "CLIENT",
        "COUPLE_PARTNER_1",
        "COUPLE_PARTNER_2",
      ],
    },
  },
} as const
