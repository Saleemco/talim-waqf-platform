import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { Search, BookOpen, Users, Building2, ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"

export function TaLimClasses() {
  const [searchParams] = useSearchParams()
  const typeParam = searchParams.get("type")
  
  const [classes, setClasses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  const typeMap: Record<string, string> = {
    tarjuma: "Tarjuma (Translation)",
    tajweed: "Tajweed (Pronunciation)",
    yassarnal: "Yassarnal Quran (Qaida)",
  }

  const typeDisplay = typeParam ? typeMap[typeParam] || "All Classes" : "All Classes"

  useEffect(() => {
    async function fetchClasses() {
      try {
        console.log("🔵 Fetching classes...")
        let query = supabase
          .from("classes")
          .select(`
            *,
            school:schools (
              name,
              code
            )
          `)
          .eq("status", "active")
          .order("name")
        
        if (typeParam && typeParam !== "all" && typeParam !== "null") {
          query = query.eq("type", typeParam)
        }
        
        const { data, error } = await query
        
        if (error) {
          console.error("❌ Error:", error)
          setError(error.message)
        } else {
          console.log("✅ Found classes:", data?.length)
          setClasses(data || [])
        }
      } catch (err: any) {
        console.error("❌ Catch:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchClasses()
  }, [typeParam])

  const filteredClasses = classes.filter((cls) =>
    cls.name.toLowerCase().includes(search.toLowerCase()) ||
    (cls.school?.name && cls.school.name.toLowerCase().includes(search.toLowerCase()))
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-[#022c16] flex items-center justify-center">
        <div className="text-white/60">Loading classes...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#022c16] flex items-center justify-center px-6">
        <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-red-400 max-w-md">
          Error: {error}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#022c16]">
      <div className="max-w-7xl mx-auto py-12 px-6">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-2">
          <Link to="/" className="text-white/40 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-serif font-bold text-white">Ta'lim Classes</h1>
        </div>
        
        <div className="mb-8">
          {typeParam && typeParam !== "all" && typeParam !== "null" ? (
            <p className="text-yellow-400 text-lg font-medium">{typeDisplay}</p>
          ) : (
            <p className="text-white/60 mt-1">Explore all Quranic learning classes</p>
          )}
          <p className="text-sm text-white/40 mt-1">{classes.length} classes available</p>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search classes or schools..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-yellow-500/50"
            />
          </div>
        </div>

        {/* Classes Grid */}
        {filteredClasses.length === 0 ? (
          <div className="text-center py-16 bg-white/5 rounded-xl border border-white/10">
            <BookOpen className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-serif font-bold text-white">No Classes Found</h3>
            <p className="text-white/50 mt-2">
              {search ? "Try adjusting your search" : "No active classes available yet"}
            </p>
            <Link to="/talim-classes" className="inline-block mt-4 px-4 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 rounded-lg text-sm font-medium transition-all">
              View All Classes
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((cls) => (
              <div key={cls.id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-yellow-500/30 transition-all hover:bg-white/[0.08]">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-serif font-bold text-white">{cls.name}</h3>
                  <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-500/20 text-yellow-500 capitalize">
                    {cls.type || "General"}
                  </span>
                </div>
                
                <p className="text-yellow-500 text-sm font-mono">{cls.code}</p>
                
                {cls.school && (
                  <div className="flex items-center gap-2 text-sm text-white/60 mt-2">
                    <Building2 className="w-3.5 h-3.5 text-white/30" />
                    <span>{cls.school.name}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-sm text-white/60 mt-1">
                  <Users className="w-3.5 h-3.5 text-white/30" />
                  <span>{cls.current_students || 0} / {cls.max_students || 0} students</span>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-xs bg-white/10 text-white/50 capitalize">
                    {cls.level || "N/A"}
                  </span>
                </div>

                <Link 
                  to={`/talim-classes/${cls.id}`}
                  className="mt-4 inline-block px-4 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 rounded-lg text-sm font-medium transition-all"
                >
                  Learn More →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}