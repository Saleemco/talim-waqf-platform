import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Link } from "react-router-dom"
import { BookOpen, School, GraduationCap, Award, MapPin, Building2, LayoutDashboard, User, LogOut, Plus, Search, Edit, Trash2, Eye, Users } from "lucide-react"
import { useAuth } from "@/app/AuthProvider"
import { ClassForm } from "../components/ClassForm"

export function ClassList() {
  const { user, signOut } = useAuth()
  const [classes, setClasses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingClass, setEditingClass] = useState<any>(null)
  const [toast, setToast] = useState({ message: "", type: "success", visible: false })

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ message, type, visible: true })
    setTimeout(() => setToast({ ...toast, visible: false }), 3000)
  }

  const fetchClasses = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("classes")
        .select("*")
        .order("name")
      
      if (error) throw error
      setClasses(data || [])
    } catch (err: any) {
      console.error("Error fetching classes:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClasses()
  }, [])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return
    
    try {
      const { error } = await supabase
        .from("classes")
        .delete()
        .eq("id", id)
      
      if (error) throw error
      showToast(`Class "${name}" deleted successfully`, "success")
      fetchClasses()
    } catch (err: any) {
      showToast(err.message || "Failed to delete class", "error")
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

  const filteredClasses = classes.filter((cls) =>
    cls.name?.toLowerCase().includes(search.toLowerCase()) ||
    cls.code?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-[#022c16] flex items-center justify-center">
        <div className="text-white">Loading classes...</div>
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
                    item.name === "Classes" ? "bg-yellow-500/10 text-yellow-500 font-medium" : "text-white/60 hover:text-white hover:bg-white/5"
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
                <h1 className="text-2xl font-serif font-bold text-white">Classes ({classes.length})</h1>
                <p className="text-sm text-white/50">Manage all classes</p>
              </div>
              <button 
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-[#022c16] font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-yellow-500/20"
                onClick={() => { setEditingClass(null); setShowForm(true) }}
              >
                <Plus className="w-4 h-4" /> Add Class
              </button>
            </div>

            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                placeholder="Search classes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-yellow-500/50"
              />
            </div>

            {filteredClasses.length === 0 ? (
              <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
                <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <h3 className="text-lg font-serif font-bold text-white mb-2">No Classes Found</h3>
                <p className="text-sm text-white/50">
                  {search ? "Try adjusting your search" : "Click 'Add Class' to create your first class"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClasses.map((cls) => (
                  <div key={cls.id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-yellow-500/30 transition-all hover:bg-white/[0.08]">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-serif font-bold text-white text-lg">{cls.name}</h3>
                        <p className="text-sm text-yellow-500 font-mono">{cls.code}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        cls.status === "active" ? "bg-green-500/20 text-green-400" : 
                        cls.status === "paused" ? "bg-yellow-500/20 text-yellow-400" : 
                        "bg-red-500/20 text-red-400"
                      }`}>
                        {cls.status || "active"}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-white/60">
                      {cls.type && (
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-3.5 h-3.5 text-white/30" />
                          <span className="capitalize">{cls.type}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-white/30" />
                        <span>{cls.current_students || 0} / {cls.max_students || 0} students</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
                      <button className="flex-1 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-medium transition-all">
                        <Eye className="w-3.5 h-3.5 inline mr-1" /> View
                      </button>
                      <button 
                        className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-medium transition-all"
                        onClick={() => { setEditingClass(cls); setShowForm(true) }}
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-xs font-medium transition-all"
                        onClick={() => handleDelete(cls.id, cls.name)}
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

      {/* Class Form Modal */}
      <ClassForm
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditingClass(null) }}
        editingClass={editingClass}
        onSuccess={() => {
          setShowForm(false)
          setEditingClass(null)
          showToast(editingClass ? "Class updated successfully" : "Class created successfully", "success")
          fetchClasses()
        }}
      />
    </div>
  )
}