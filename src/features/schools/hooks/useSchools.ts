import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import type { School, SchoolFormData } from "../types/school.types"

export function useSchools() {
  console.log("🔵 useSchools hook called")
  const queryClient = useQueryClient()

  // Get all schools
  const schoolsQuery = useQuery({
    queryKey: ["schools"],
    queryFn: async () => {
      console.log("🔵 Fetching schools from Supabase...")
      const { data, error } = await supabase
        .from("schools")
        .select("*")
        .order("name")
      
      if (error) {
        console.error("🔴 Supabase error:", error)
        throw error
      }
      console.log("🟢 Schools fetched:", data?.length)
      return data as School[]
    },
  })

  // Get a single school by ID
  const getSchool = (id: string) => {
    return useQuery({
      queryKey: ["schools", id],
      queryFn: async () => {
        console.log("🔵 Fetching school:", id)
        const { data, error } = await supabase
          .from("schools")
          .select("*")
          .eq("id", id)
          .single()
        
        if (error) throw error
        return data as School
      },
      enabled: !!id,
    })
  }

  // Create school mutation
  const createSchool = useMutation({
    mutationFn: async (newSchool: SchoolFormData) => {
      console.log("🔵 Creating school:", newSchool)
      const { data, error } = await supabase
        .from("schools")
        .insert([newSchool])
        .select()
        .single()
      
      if (error) throw error
      console.log("🟢 School created:", data)
      return data as School
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schools"] })
    },
  })

  // Update school mutation
  const updateSchool = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<School> & { id: string }) => {
      console.log("🔵 Updating school:", id, updates)
      const { data, error } = await supabase
        .from("schools")
        .update(updates)
        .eq("id", id)
        .select()
        .single()
      
      if (error) throw error
      console.log("🟢 School updated:", data)
      return data as School
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schools"] })
    },
  })

  // Delete school mutation
  const deleteSchool = useMutation({
    mutationFn: async (id: string) => {
      console.log("🔵 Deleting school:", id)
      const { error } = await supabase
        .from("schools")
        .delete()
        .eq("id", id)
      
      if (error) throw error
      console.log("🟢 School deleted:", id)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schools"] })
    },
  })

  console.log("🔵 useSchools returning:", { 
    schools: schoolsQuery.data?.length, 
    isLoading: schoolsQuery.isLoading,
    error: schoolsQuery.error 
  })

  return {
    schools: schoolsQuery.data || [],
    isLoading: schoolsQuery.isLoading,
    error: schoolsQuery.error,
    getSchool,
    createSchool,
    updateSchool,
    deleteSchool,
  }
}
