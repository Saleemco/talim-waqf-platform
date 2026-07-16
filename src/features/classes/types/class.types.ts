export interface Class {
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
  status: "active" | "paused" | "archived"
  start_date: string | null
  end_date: string | null
  created_at: string
  updated_at: string
  school?: {
    name: string
    code: string
  }
}

export interface ClassFormData {
  school_id: string
  name: string
  code: string
  description: string
  level: string
  type: string
  instructor_id: string
  max_students: number
  current_students: number
  schedule: string
  room: string
  status: "active" | "paused" | "archived"
  start_date: string
  end_date: string
}

export type ClassLevel = "beginner" | "intermediate" | "advanced"
export type ClassType = "quran" | "arabic" | "islamic_studies" | "hifz"
export type ClassStatus = "active" | "paused" | "archived"
