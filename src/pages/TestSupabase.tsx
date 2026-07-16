import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

export function TestSupabase() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [debug, setDebug] = useState<string>("")

  useEffect(() => {
    async function fetchData() {
      try {
        setDebug("Starting fetch...")
        console.log("🔵 Fetching classes...")
        console.log("🔵 Supabase client:", supabase)
        
        setDebug("Querying classes table...")
        const { data, error } = await supabase
          .from("classes")
          .select("*")
        
        if (error) {
          console.error("❌ Error:", error)
          setError(error.message)
          setDebug("Error: " + error.message)
        } else {
          console.log("✅ Data:", data)
          setData(data || [])
          setDebug(`Found ${data?.length || 0} classes`)
        }
      } catch (err: any) {
        console.error("❌ Catch:", err)
        setError(err.message)
        setDebug("Catch: " + err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#022c16] flex items-center justify-center">
        <div className="text-white/60">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#022c16] flex items-center justify-center px-6">
        <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6 max-w-lg w-full">
          <p className="text-red-400 font-bold">❌ Error</p>
          <p className="text-red-300/80 mt-2">{error}</p>
          <p className="text-white/40 text-sm mt-4">Debug: {debug}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#022c16] p-8">
      <h1 className="text-2xl font-bold text-white mb-2">📊 Classes in Database</h1>
      <p className="text-white/60 mb-1">Found {data.length} classes</p>
      <p className="text-white/30 text-sm mb-4">Debug: {debug}</p>
      
      {data.length === 0 ? (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6 text-center">
          <p className="text-yellow-400">No classes found</p>
          <p className="text-white/40 text-sm mt-2">Debug info: {debug}</p>
          <p className="text-white/30 text-xs mt-4">Check console (F12) for more details</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((item) => (
            <div key={item.id} className="bg-white/5 border border-white/10 rounded-lg p-4 flex justify-between items-center">
              <div>
                <span className="text-white font-medium">{item.name}</span>
                <span className="text-white/40 text-sm ml-3">{item.code}</span>
                {item.type && (
                  <span className="ml-3 px-2 py-0.5 rounded-full text-xs bg-yellow-500/20 text-yellow-500">
                    {item.type}
                  </span>
                )}
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                item.status === "active" ? "bg-green-500/20 text-green-400" : 
                item.status === "paused" ? "bg-yellow-500/20 text-yellow-400" : 
                "bg-red-500/20 text-red-400"
              }`}>
                {item.status || "active"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}