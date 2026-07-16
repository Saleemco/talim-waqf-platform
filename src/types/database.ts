export type Database = {
  public: {
    Tables: {
      schools: {
        Row: {
          id: string
          name: string
          code: string
          address: string | null
          city: string | null
          state: string | null
          country: string
          phone: string | null
          email: string | null
          website: string | null
          established_date: string | null
          type: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          code: string
          address?: string | null
          city?: string | null
          state?: string | null
          country?: string
          phone?: string | null
          email?: string | null
          website?: string | null
          established_date?: string | null
          type?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          code?: string
          address?: string | null
          city?: string | null
          state?: string | null
          country?: string
          phone?: string | null
          email?: string | null
          website?: string | null
          established_date?: string | null
          type?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      classes: {
        Row: {
          id: string
          school_id: string
          name: string
          code: string
          description: string | null
          level: string | null
          type: string | null
          instructor_id: string | null
          max_students: number
          current_students: number
          schedule: any | null
          room: string | null
          status: string
          start_date: string | null
          end_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          school_id: string
          name: string
          code: string
          description?: string | null
          level?: string | null
          type?: string | null
          instructor_id?: string | null
          max_students?: number
          current_students?: number
          schedule?: any | null
          room?: string | null
          status?: string
          start_date?: string | null
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          name?: string
          code?: string
          description?: string | null
          level?: string | null
          type?: string | null
          instructor_id?: string | null
          max_students?: number
          current_students?: number
          schedule?: any | null
          room?: string | null
          status?: string
          start_date?: string | null
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      registrations: {
        Row: {
          id: string
          user_id: string
          registration_type: string
          full_name: string
          email: string
          phone: string | null
          state: string | null
          city: string | null
          gender: string | null
          age: number | null
          previous_knowledge: string | null
          preferred_school: string | null
          qualification: string | null
          experience: string | null
          specialization: string | null
          parent_name: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          registration_type: string
          full_name: string
          email: string
          phone?: string | null
          state?: string | null
          city?: string | null
          gender?: string | null
          age?: number | null
          previous_knowledge?: string | null
          preferred_school?: string | null
          qualification?: string | null
          experience?: string | null
          specialization?: string | null
          parent_name?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          registration_type?: string
          full_name?: string
          email?: string
          phone?: string | null
          state?: string | null
          city?: string | null
          gender?: string | null
          age?: number | null
          previous_knowledge?: string | null
          preferred_school?: string | null
          qualification?: string | null
          experience?: string | null
          specialization?: string | null
          parent_name?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
