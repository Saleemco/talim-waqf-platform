import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface SchoolFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  editingSchool?: any
}

export function SchoolForm({ isOpen, onClose, onSuccess, editingSchool }: SchoolFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    address: "",
    city: "",
    state: "",
    country: "Nigeria",
    phone: "",
    email: "",
    website: "",
    established_date: "",
    type: "secondary",
    status: "active",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (editingSchool) {
      setFormData({
        name: editingSchool.name || "",
        code: editingSchool.code || "",
        address: editingSchool.address || "",
        city: editingSchool.city || "",
        state: editingSchool.state || "",
        country: editingSchool.country || "Nigeria",
        phone: editingSchool.phone || "",
        email: editingSchool.email || "",
        website: editingSchool.website || "",
        established_date: editingSchool.established_date || "",
        type: editingSchool.type || "secondary",
        status: editingSchool.status || "active",
      })
    } else {
      setFormData({
        name: "",
        code: "",
        address: "",
        city: "",
        state: "",
        country: "Nigeria",
        phone: "",
        email: "",
        website: "",
        established_date: "",
        type: "secondary",
        status: "active",
      })
    }
    setError("")
  }, [editingSchool, isOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!formData.name || formData.name.trim().length < 2) {
      setError("School name is required (minimum 2 characters)")
      setLoading(false)
      return
    }
    if (!formData.code || formData.code.trim().length < 2) {
      setError("School code is required (minimum 2 characters)")
      setLoading(false)
      return
    }

    try {
      if (editingSchool) {
        const { error } = await supabase
          .from("schools")
          .update(formData as any)
          .eq("id", editingSchool.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from("schools")
          .insert([formData as any])
        if (error) throw error
      }

      onSuccess()
      onClose()
    } catch (err: any) {
      console.error("Error saving school:", err)
      if (err.message?.includes("duplicate key")) {
        setError("A school with this code already exists. Please use a unique code.")
      } else {
        setError(err.message || "Failed to save school. Please try again.")
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
            {editingSchool ? "Edit School" : "Add New School"}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">
                School Name *
              </label>
              <input
                type="text"
                name="name"
                placeholder="e.g. Al-Furqan Model School"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-yellow-500/50"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">
                School Code *
              </label>
              <input
                type="text"
                name="code"
                placeholder="e.g. AFMS-001"
                value={formData.code}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-yellow-500/50"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-white/60 mb-1.5">
              Address
            </label>
            <input
              type="text"
              name="address"
              placeholder="e.g. 123 Main Street"
              value={formData.address}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-yellow-500/50"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">
                City
              </label>
              <input
                type="text"
                name="city"
                placeholder="e.g. Kano"
                value={formData.city}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-yellow-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">
                State
              </label>
              <input
                type="text"
                name="state"
                placeholder="e.g. Kano"
                value={formData.state}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-yellow-500/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">
                Country
              </label>
              <input
                type="text"
                name="country"
                placeholder="Nigeria"
                value={formData.country}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-yellow-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">
                School Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500/50"
              >
                <option value="primary" className="bg-[#022c16]">Primary</option>
                <option value="secondary" className="bg-[#022c16]">Secondary</option>
                <option value="tertiary" className="bg-[#022c16]">Tertiary</option>
                <option value="adult" className="bg-[#022c16]">Adult Education</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                placeholder="+234 800 123 4567"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-yellow-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="school@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-yellow-500/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">
                Website
              </label>
              <input
                type="text"
                name="website"
                placeholder="https://example.com"
                value={formData.website}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-yellow-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">
                Established Date
              </label>
              <input
                type="date"
                name="established_date"
                value={formData.established_date}
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
              <option value="inactive" className="bg-[#022c16]">Inactive</option>
              <option value="archived" className="bg-[#022c16]">Archived</option>
            </select>
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
                editingSchool ? "Update School" : "Create School"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}