import { useAuth } from '@/app/AuthProvider'
import { LogOut } from "lucide-react"

export function Header() {
  const { user, signOut } = useAuth()

  return (
    <header className="bg-[#022c16]/90 backdrop-blur-md border-b border-white/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <h1 className="text-xl font-serif font-bold text-white">Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-white/60">
            {user?.full_name || user?.email}
          </span>
          <button
            onClick={signOut}
            className="p-2 rounded-lg hover:bg-white/5 text-white/60 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  )
}