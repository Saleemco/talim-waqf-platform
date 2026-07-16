import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Link } from "react-router-dom"
import { BookOpen, School, GraduationCap, Award, MapPin, Building2, LayoutDashboard, User, LogOut, Plus, Search, Edit, Trash2, Eye, Phone, Mail } from "lucide-react"
import { useAuth } from "@/app/AuthProvider"
import { SchoolForm } from "../components/SchoolForm"

export function SchoolList() {
  const { user, signOut } = useAuth()
  const [schools, setSchools] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingSchool, setEditingSchool] = useState<any>(null)
  const [toast, setToast] = useState({ message: "", type: "success", visible: false })

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ message, type, visible: true })
    setTimeout(() => setToast({ ...toast, visible: false }), 3000)
  }

  const fetchSchools = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("schools")
        .select("*")
        .order("name")
      
      if (error) throw error
      setSchools(data || [])
    } catch (err: any) {
      console.error("Error fetching schools:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSchools()
  }, [])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return
    
    try {
      const { error } = await supabase
        .from("schools")
        .delete()
        .eq("id", id)
      
      if (error) throw error
      showToast(`School "${name}" deleted successfully`, "success")
      fetchSchools()
    } catch (err: any) {
      showToast(err.message || "Failed to delete school", "error")
    }
  }

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Schools", href: "/schools", icon: School },
    { name: "Classes", href: "/classes", icon: BookOpen },
    { name: "Hufaaz", href: "/hufaaz", icon: Award },
    { name: "ITQA", href: "/itqa", icon: GraduationCap },
    { name: "Waqf", href: "/waqf", icon: Building2 },
    { name: "Resources", href: "/resources", icon: MapPin },
  ]

  const filteredSchools = schools.filter((school) =>
    school.name?.toLowerCase().includes(search.toLowerCase()) ||
    school.code?.toLowerCase().includes(search.toLowerCase()) ||
    school.city?.toLowerCase().includes(search.toLowerCase()) ||
    school.state?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-[#022c16] flex items-center justify-center">
        <div className="text-white">Loading schools...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#022c16] p-8">
        <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-red-400">
          Error: {error}
          <button 
            className="ml-4 px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-white"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#022c16] flex">
      {/* Toast */}
      {toast.visible && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl text-sm font-medium ${
          toast.type === "success" ? "bg-green-500/20 border border-green-500/30 text-green-400" :
          toast.type === "error" ? "bg-red-500/20 border border-red-500/30 text-red-400" :
          "bg-blue-500/20 border border-blue-500/30 text-blue-400"
        }`}>
          {toast.message}
        </div>
      )}

      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#022c16]/90 border border-white/10 text-white"
      >
        {sidebarOpen ? "✕" : "☰"}
      </button>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#011f0f] border-r border-white/10 transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-[#022c16]" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-sm text-white">Ta'lim Board</h1>
              <p className="text-[8px] text-yellow-500 uppercase tracking-wider">Admin Portal</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all ${
                    item.name === "Schools" ? "bg-yellow-500/10 text-yellow-500 font-medium" : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* User section */}
          <div className="border-t border-white/10 p-4">
            <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-white/5">
              <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <User className="w-4 h-4 text-yellow-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">
                  {user?.full_name || user?.email || "User"}
                </p>
                <p className="text-[10px] text-white/40 capitalize">{user?.role || "User"}</p>
              </div>
              <button
                onClick={signOut}
                className="p-1.5 rounded-lg hover:bg-white/5 text-white/40 hover:text-white/70 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 lg:ml-64">
        <div className="p-4 md:p-8">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-serif font-bold text-white">Schools ({schools.length})</h1>
                <p className="text-sm text-white/50">Manage all registered schools</p>
              </div>
              <button 
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-[#022c16] font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-yellow-500/20"
                onClick={() => { setEditingSchool(null); setShowForm(true) }}
              >
                <Plus className="w-4 h-4" /> Add School
              </button>
            </div>

            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                placeholder="Search schools..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-yellow-500/50"
              />
            </div>

            {filteredSchools.length === 0 ? (
              <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
                <Building2 className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <h3 className="text-lg font-serif font-bold text-white mb-2">No Schools Found</h3>
                <p className="text-sm text-white/50">
                  {search ? "Try adjusting your search" : "Click 'Add School' to create your first school"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSchools.map((school) => (
                  <div key={school.id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-yellow-500/30 transition-all hover:bg-white/[0.08]">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-serif font-bold text-white text-lg">{school.name}</h3>
                        <p className="text-sm text-yellow-500 font-mono">{school.code}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        school.status === "active" ? "bg-green-500/20 text-green-400" : 
                        school.status === "inactive" ? "bg-yellow-500/20 text-yellow-400" : 
                        "bg-red-500/20 text-red-400"
                      }`}>
                        {school.status || "active"}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-white/60">
                      {(school.city || school.state) && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-white/30" />
                          <span>{[school.city, school.state].filter(Boolean).join(", ")}</span>
                        </div>
                      )}
                      {school.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-white/30" />
                          <span>{school.phone}</span>
                        </div>
                      )}
                      {school.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-white/30" />
                          <span className="truncate">{school.email}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
                      <button className="flex-1 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-medium transition-all">
                        <Eye className="w-3.5 h-3.5 inline mr-1" /> View
                      </button>
                      <button 
                        className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-medium transition-all"
                        onClick={() => { setEditingSchool(school); setShowForm(true) }}
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-xs font-medium transition-all"
                        onClick={() => handleDelete(school.id, school.name)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* School Form Modal */}
      <SchoolForm
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditingSchool(null) }}
        editingSchool={editingSchool}
        onSuccess={() => {
          setShowForm(false)
          setEditingSchool(null)
          showToast(editingSchool ? "School updated successfully" : "School created successfully", "success")
          fetchSchools()
        }}
      />
    </div>
  )
}