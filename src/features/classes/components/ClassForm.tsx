import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface ClassFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  editingClass?: any
}

export function ClassForm({ isOpen, onClose, onSuccess, editingClass }: ClassFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    school_id: "",
    description: "",
    level: "beginner",
    type: "quran",
    max_students: 30,
    current_students: 0,
    room: "",
    status: "active",
    start_date: "",
    end_date: "",
  })
  const [schools, setSchools] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [loadingSchools, setLoadingSchools] = useState(true)

  useEffect(() => {
    async function fetchSchools() {
      try {
        const { data, error } = await supabase
          .from("schools")
          .select("id, name")
          .order("name")
        
        if (error) throw error
        setSchools(data || [])
      } catch (err: any) {
        console.error("Error fetching schools:", err)
      } finally {
        setLoadingSchools(false)
      }
    }
    fetchSchools()
  }, [])

  useEffect(() => {
    if (editingClass) {
      setFormData({
        name: editingClass.name || "",
        code: editingClass.code || "",
        school_id: editingClass.school_id || "",
        description: editingClass.description || "",
        level: editingClass.level || "beginner",
        type: editingClass.type || "quran",
        max_students: editingClass.max_students || 30,
        current_students: editingClass.current_students || 0,
        room: editingClass.room || "",
        status: editingClass.status || "active",
        start_date: editingClass.start_date || "",
        end_date: editingClass.end_date || "",
      })
    } else {
      setFormData({
        name: "",
        code: "",
        school_id: "",
        description: "",
        level: "beginner",
        type: "quran",
        max_students: 30,
        current_students: 0,
        room: "",
        status: "active",
        start_date: "",
        end_date: "",
      })
    }
    setError("")
  }, [editingClass, isOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.type === "number" ? parseInt(e.target.value) || 0 : e.target.value
    setFormData({ ...formData, [e.target.name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!formData.name || formData.name.trim().length < 2) {
      setError("Class name is required (minimum 2 characters)")
      setLoading(false)
      return
    }
    if (!formData.code || formData.code.trim().length < 2) {
      setError("Class code is required (minimum 2 characters)")
      setLoading(false)
      return
    }
    if (!formData.school_id) {
      setError("Please select a school")
      setLoading(false)
      return
    }

    try {
      const dataToSave = {
        ...formData,
        max_students: parseInt(String(formData.max_students)) || 30,
        current_students: parseInt(String(formData.current_students)) || 0,
      }

      if (editingClass) {
        const { error } = await supabase
          .from("classes")
          .update(dataToSave as any)
          .eq("id", editingClass.id)
        
        if (error) throw error
      } else {
        const { error } = await supabase
          .from("classes")
          .insert([dataToSave as any])
        
        if (error) throw error
      }

      onSuccess()
      onClose()
    } catch (err: any) {
      console.error("Error saving class:", err)
      if (err.message?.includes("duplicate key")) {
        setError("A class with this code already exists. Please use a unique code.")
      } else {
        setError(err.message || "Failed to save class. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#022c16] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-serif font-bold text-white">
            {editingClass ? "Edit Class" : "Add New Class"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/5 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-white/60 mb-1.5">
              School *
            </label>
            <select
              name="school_id"
              value={formData.school_id}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500/50"
              required
              disabled={loadingSchools}
            >
              <option value="" className="bg-[#022c16]">Select a school...</option>
              {schools.map((school) => (
                <option key={school.id} value={school.id} className="bg-[#022c16]">
                  {school.name}
                </option>
              ))}
            </select>
            {loadingSchools && <p className="text-xs text-white/40 mt-1">Loading schools...</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">
                Class Name *
              </label>
              <input
                type="text"
                name="name"
                placeholder="e.g. Quran Class"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-yellow-500/50"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">
                Class Code *
              </label>
              <input
                type="text"
                name="code"
                placeholder="e.g. QC-001"
                value={formData.code}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-yellow-500/50"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">
                Class Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500/50"
              >
                <option value="quran" className="bg-[#022c16]">Quran</option>
                <option value="arabic" className="bg-[#022c16]">Arabic</option>
                <option value="islamic_studies" className="bg-[#022c16]">Islamic Studies</option>
                <option value="hifz" className="bg-[#022c16]">Hifz</option>
                <option value="tarjuma" className="bg-[#022c16]">Tarjuma</option>
                <option value="tajweed" className="bg-[#022c16]">Tajweed</option>
                <option value="yassarnal" className="bg-[#022c16]">Yassarnal</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">
                Level
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500/50"
              >
                <option value="beginner" className="bg-[#022c16]">Beginner</option>
                <option value="intermediate" className="bg-[#022c16]">Intermediate</option>
                <option value="advanced" className="bg-[#022c16]">Advanced</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">
                Max Students
              </label>
              <input
                type="number"
                name="max_students"
                placeholder="30"
                value={formData.max_students}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-yellow-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">
                Room
              </label>
              <input
                type="text"
                name="room"
                placeholder="e.g. Room 101"
                value={formData.room}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-yellow-500/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">
                End Date
              </label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-white/60 mb-1.5">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500/50"
            >
              <option value="active" className="bg-[#022c16]">Active</option>
              <option value="paused" className="bg-[#022c16]">Paused</option>
              <option value="archived" className="bg-[#022c16]">Archived</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-white/60 mb-1.5">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Brief description of the class..."
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-yellow-500/50 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 text-[#022c16] font-bold rounded-xl transition-all shadow-lg shadow-yellow-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#022c16] border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                editingClass ? "Update Class" : "Create Class"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}