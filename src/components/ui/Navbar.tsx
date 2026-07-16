import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '@/app/AuthProvider'
import {
  Menu, X, BookOpen, GraduationCap, Landmark, ScrollText,
  Database, BookMarked, Globe, Home, LogIn, LogOut, User,
} from 'lucide-react'
import clsx from 'clsx'

const navLinks = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/madrasatu-tahfiz', label: 'Madrasatu Tahfiz', icon: BookOpen },
  { to: '/talim-classes', label: 'Talim Classes', icon: GraduationCap },
  { to: '/arabic-learning', label: 'Arabic Learning', icon: Globe },
  { to: '/itqa-registration', label: 'ITQA', icon: ScrollText },
  { to: '/waqf-e-ardhi', label: 'Waqf E Ardhi', icon: Landmark },
  { to: '/hufaaz-db', label: 'Hufaaz DB', icon: Database },
  { to: '/resources', label: 'Resources', icon: BookMarked },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <nav className="bg-primary text-white sticky top-0 z-50 shadow-md">
      <div className="container-custom flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <BookOpen className="w-6 h-6 text-accent" />
          Nurul-Ardhi Hub
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-light transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-white/80 flex items-center gap-1">
                <User className="w-4 h-4" />
                {user.full_name || user.email}
              </span>
              <button
                onClick={handleSignOut}
                className="px-3 py-1.5 text-sm bg-white/10 hover:bg-white/20 rounded-md transition-colors flex items-center gap-1"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 text-sm bg-accent text-primary-dark font-semibold rounded-md hover:bg-accent-dark transition-colors flex items-center gap-1"
            >
              <LogIn className="w-4 h-4" />
              Login
            </Link>
          )}
        </div>

        <button
          className="lg:hidden p-2 rounded-md hover:bg-primary-light"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div className={clsx('lg:hidden border-t border-white/10', open ? 'block' : 'hidden')}>
        <div className="container-custom py-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-primary-light transition-colors"
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </Link>
          ))}
          {user ? (
            <button
              onClick={() => { setOpen(false); handleSignOut() }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-primary-light transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm bg-accent text-primary-dark font-semibold"
            >
              <LogIn className="w-4 h-4" />
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
