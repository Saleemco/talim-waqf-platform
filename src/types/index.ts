export interface User {
  id: string
  email: string
  full_name?: string
  role?: string
  created_at?: string
}

export interface Database {
  public: {
    Tables: {
      schools: {
        Row: any
        Insert: any
        Update: any
      }
      classes: {
        Row: any
        Insert: any
        Update: any
      }
      hufaaz: {
        Row: any
        Insert: any
        Update: any
      }
      itqa_registrations: {
        Row: any
        Insert: any
        Update: any
      }
      events: {
        Row: any
        Insert: any
        Update: any
      }
      enrollments: {
        Row: any
        Insert: any
        Update: any
      }
      user_roles: {
        Row: any
        Insert: any
        Update: any
      }
    }
  }
}
