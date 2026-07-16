import { ReactNode, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { 
  BookOpen, 
  School, 
  GraduationCap, 
  Award, 
  MapPin, 
  Building2, 
  Menu, 
  X,
  User,
  LogOut,
  LayoutDashboard,
  ChevronDown
} from "lucide-react"
import { useAuth } from "@/app/AuthProvider"

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { user, signOut } = useAuth()
  const location = useLocation()

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Schools", href: "/schools", icon: School },
    { name: "Classes", href: "/classes", icon: BookOpen },
    { name: "Hufaaz", href: "/hufaaz", icon: Award },
    { name: "ITQA", href: "/itqa", icon: GraduationCap },
    { name: "Waqf", href: "/waqf", icon: Building2 },
    { name: "Resources", href: "/resources", icon: MapPin },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="min-h-screen bg-[#022c16] flex">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#022c16]/90 border border-white/10 text-white"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#011f0f] border-r border-white/10 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-[#022c16]" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-sm text-white">Ta'\''lim Board</h1>
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
                    isActive(item.href)
                      ? "bg-yellow-500/10 text-yellow-500 font-medium"
                      : "text-white/60 hover:text-white hover:bg-white/5"
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
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 w-full px-2 py-2 rounded-xl hover:bg-white/5 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-yellow-500" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-xs font-medium text-white truncate">
                    {user?.full_name || user?.email || "User"}
                  </p>
                  <p className="text-[10px] text-white/40 capitalize">{user?.role || "User"}</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 p-2 bg-[#022c16] border border-white/10 rounded-xl shadow-xl">
                  <button
                    onClick={() => {
                      setDropdownOpen(false)
                      signOut()
                    }}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 lg:ml-64 min-h-screen">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
