export interface School {
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
  status: "active" | "inactive" | "archived"
  created_at: string
  updated_at: string
}

export interface SchoolFormData {
  name: string
  code: string
  address: string
  city: string
  state: string
  country: string
  phone: string
  email: string
  website: string
  established_date: string
  type: string
  status: "active" | "inactive" | "archived"
}

export type SchoolStatus = "active" | "inactive" | "archived"
export type SchoolType = "primary" | "secondary" | "tertiary" | "adult"
