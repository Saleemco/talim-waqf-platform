import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import type { Class, ClassFormData } from "../types/class.types"

export function useClasses() {
  const queryClient = useQueryClient()

  // Get all classes with school info
  const classesQuery = useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("classes")
        .select(`
          *,
          school:schools (
            name,
            code
          )
        `)
        .order("name")
      
      if (error) throw error
      return data as Class[]
    },
  })

  // Get a single class by ID
  const getClass = (id: string) => {
    return useQuery({
      queryKey: ["classes", id],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("classes")
          .select(`
            *,
            school:schools (
              name,
              code
            )
          `)
          .eq("id", id)
          .single()
        
        if (error) throw error
        return data as Class
      },
      enabled: !!id,
    })
  }

  // Get classes by school
  const getClassesBySchool = (schoolId: string) => {
    return useQuery({
      queryKey: ["classes", "school", schoolId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("classes")
          .select(`
            *,
            school:schools (
              name,
              code
            )
          `)
          .eq("school_id", schoolId)
          .order("name")
        
        if (error) throw error
        return data as Class[]
      },
      enabled: !!schoolId,
    })
  }

  // Create class mutation
  const createClass = useMutation({
    mutationFn: async (newClass: ClassFormData) => {
      const { data, error } = await supabase
        .from("classes")
        .insert([newClass])
        .select()
        .single()
      
      if (error) throw error
      return data as Class
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] })
    },
  })

  // Update class mutation
  const updateClass = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Class> & { id: string }) => {
      const { data, error } = await supabase
        .from("classes")
        .update(updates)
        .eq("id", id)
        .select()
        .single()
      
      if (error) throw error
      return data as Class
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] })
    },
  })

  // Delete class mutation
  const deleteClass = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("classes")
        .delete()
        .eq("id", id)
      
      if (error) throw error
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] })
    },
  })

  return {
    classes: classesQuery.data || [],
    isLoading: classesQuery.isLoading,
    error: classesQuery.error,
    getClass,
    getClassesBySchool,
    createClass,
    updateClass,
    deleteClass,
  }
}
