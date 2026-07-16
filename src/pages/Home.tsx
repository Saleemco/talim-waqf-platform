import { useState, useEffect } from "react"
import { 
  BookOpen, 
  Award, 
  MapPin, 
  ShieldCheck, 
  Building2, 
  ArrowRight, 
  ChevronDown, 
  GraduationCap, 
  Search, 
  ChevronRight, 
  Heart, 
  UserPlus,
  Globe,
  Lock,
  TrendingUp,
  CheckCircle,
  Users,
  UserCheck,
  AlertCircle,
  Menu
} from "lucide-react"
import { motion } from "motion/react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/app/AuthProvider"
import { Button, Input, Card, Modal, Toast, Select } from "@/components/ui"
// Ta'lim Classes Content Component
function TaLimClassesContent({ type }: { type?: string }) {
  const [classes, setClasses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  useEffect(() => {
    async function fetchClasses() {
      try {
        console.log("🔵 Fetching classes with type:", type)
        let query = supabase
          .from("classes")
          .select(`
            *,
            school:schools (
              name,
              code
            )
          `)
          .order("name")
        
        if (type) {
          query = query.eq("type", type)
        }
        
        const { data, error } = await query
        
        if (error) {
          console.error("❌ Supabase error:", error)
          setError(error.message)
        } else {
          console.log("✅ Classes found:", data?.length)
          setClasses(data || [])
        }
      } catch (err: any) {
        console.error("❌ Fetch error:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchClasses()
  }, [type])

  const filteredClasses = classes.filter((cls) =>
    cls.name?.toLowerCase().includes(search.toLowerCase()) ||
    cls.code?.toLowerCase().includes(search.toLowerCase()) ||
    cls.school?.name?.toLowerCase().includes(search.toLowerCase())
  )

  const getTypeDisplay = () => {
    switch(type) {
      case "tarjuma": return "Tarjuma (Translation)"
      case "tajweed": return "Tajweed (Pronunciation)"
      case "yassarnal": return "Yassarnal Quran (Qaida)"
      default: return "All Classes"
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 text-center">
        <div className="text-white/60">Loading classes...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6">
        <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
          Error: {error}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">Ta'lim Classes</h1>
        {type && (
          <p className="text-yellow-400 text-base sm:text-lg font-medium mt-1 sm:mt-2">{getTypeDisplay()}</p>
        )}
        <p className="text-sm text-white/40 mt-1">{classes.length} classes available</p>
      </div>

      <div className="relative max-w-md mb-6 sm:mb-8">
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
        <div className="text-center py-12 sm:py-16 bg-white/5 rounded-xl border border-white/10">
          <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-white/20 mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-serif font-bold text-white">No Classes Found</h3>
          <p className="text-white/50 mt-2 text-sm">
            {search ? "Try adjusting your search" : "No classes available"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredClasses.map((cls) => (
            <div key={cls.id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-yellow-500/30 transition-all hover:bg-white/[0.08]">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-base sm:text-lg font-serif font-bold text-white">{cls.name}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-yellow-500/20 text-yellow-500 capitalize whitespace-nowrap ml-2">
                  {cls.type || "General"}
                </span>
              </div>
              
              <p className="text-yellow-500 text-sm font-mono">{cls.code}</p>
              
              {cls.school && (
                <div className="flex items-center gap-2 text-sm text-white/60 mt-2">
                  <Building2 className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
                  <span className="truncate">{cls.school.name}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2 text-sm text-white/60 mt-1">
                <Users className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
                <span>{cls.current_students || 0} / {cls.max_students || 0} students</span>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/10 text-white/50 capitalize">
                  {cls.level || "N/A"}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                  cls.status === "active" ? "bg-green-500/20 text-green-400" : 
                  cls.status === "paused" ? "bg-yellow-500/20 text-yellow-400" : 
                  "bg-red-500/20 text-red-400"
                }`}>
                  {cls.status || "active"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function Home() {
  const { signUp } = useAuth()
  const [activeTab, setActiveTab] = useState("home")
  const [showHufaazModal, setShowHufaazModal] = useState(false)
  const [showSchoolsModal, setShowSchoolsModal] = useState(false)
  const [showClassesDropdown, setShowClassesDropdown] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const [toast, setToast] = useState({ message: "", type: "info" as "success" | "error" | "info", isVisible: false })
  
  const [registrationRole, setRegistrationRole] = useState<"student" | "teacher">("student")
  const [step, setStep] = useState(1)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    parentName: "",
    studentName: "",
    age: "",
    gender: "Male",
    state: "Kano",
    city: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    previousKnowledge: "No Knowledge (Complete Beginner)",
    preferredSchool: "Al-Furqan Model School, Kano",
    teacherName: "",
    qualification: "Full Hifz-ul-Quran (Certified Hafiz)",
    experience: "",
    specialization: "Foundation Classes (Qaida)",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleNavClick = (tab: string) => {
    setActiveTab(tab)
    setMobileMenuOpen(false)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (error) setError("")
  }

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ message, type, isVisible: true })
    setTimeout(() => {
      setToast({ ...toast, isVisible: false })
    }, 3000)
  }

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsSubmitting(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      setIsSubmitting(false)
      return
    }

    const fullName = registrationRole === "student" ? formData.studentName : formData.teacherName
    if (!fullName || fullName.trim().length < 2) {
      setError("Please enter a valid full name")
      setIsSubmitting(false)
      return
    }

    if (!formData.email || !formData.email.includes("@")) {
      setError("Please enter a valid email address")
      setIsSubmitting(false)
      return
    }

    if (!formData.phone || formData.phone.replace(/\s/g, "").length < 10) {
      setError("Please enter a valid phone number (minimum 10 digits)")
      setIsSubmitting(false)
      return
    }

    try {
      const { data: authData, error: authError } = await signUp(
        formData.email,
        formData.password,
        fullName,
        registrationRole
      )

      if (authError) {
        console.error("Auth error:", authError)
        if (authError.message?.includes("User already registered")) {
          setError("This email is already registered. Please go to Login and sign in, or use a different email.")
        } else if (authError.message?.includes("Password should be at least")) {
          setError("Password must be at least 6 characters.")
        } else {
          setError(authError.message || "Account creation failed. Please try again.")
        }
        setIsSubmitting(false)
        return
      }

      if (!authData?.user) {
        setError("Account creation failed. Please try again.")
        setIsSubmitting(false)
        return
      }

      const registrationData = {
        user_id: authData.user.id,
        registration_type: registrationRole,
        full_name: fullName,
        email: formData.email,
        phone: formData.phone,
        state: formData.state,
        city: formData.city || "",
        gender: registrationRole === "student" ? formData.gender : "",
        age: registrationRole === "student" && formData.age ? parseInt(formData.age) : null,
        previous_knowledge: registrationRole === "student" ? formData.previousKnowledge : "",
        preferred_school: registrationRole === "student" ? formData.preferredSchool : "",
        qualification: registrationRole === "teacher" ? formData.qualification : "",
        experience: registrationRole === "teacher" ? formData.experience : "",
        specialization: registrationRole === "teacher" ? formData.specialization : "",
        parent_name: registrationRole === "student" ? formData.parentName : "",
        status: "pending"
      }

      console.log("Saving registration data:", registrationData)

      const { error: dbError } = await supabase
        .from('registrations')
        .insert([registrationData])

      if (dbError) {
        console.error("Database error:", dbError)
        console.error("Error details:", JSON.stringify(dbError, null, 2))
        
        if (dbError.code === "23505") {
          setError("This registration already exists. Please contact support.")
        } else if (dbError.code === "42501") {
          setError("Permission denied. Please make sure you are logged in or contact support.")
        } else {
          setError(`Database error: ${dbError.message || "Unknown error"}`)
        }
        setIsSubmitting(false)
        return
      }

      console.log("Registration saved successfully!")
      showToast("Registration successful! Redirecting to login...", "success")

      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        setStep(1)
        setFormData({
          parentName: "",
          studentName: "",
          age: "",
          gender: "Male",
          state: "Kano",
          city: "",
          phone: "",
          email: "",
          password: "",
          confirmPassword: "",
          previousKnowledge: "No Knowledge (Complete Beginner)",
          preferredSchool: "Al-Furqan Model School, Kano",
          teacherName: "",
          qualification: "Full Hifz-ul-Quran (Certified Hafiz)",
          experience: "",
          specialization: "Foundation Classes (Qaida)",
        })
        window.location.href = "/login"
      }, 3000)

    } catch (err: any) {
      console.error("Registration error:", err)
      setError(err.message || "Registration failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const ComingSoon = ({ title, icon: Icon }: { title: string; icon: any }) => (
    <div className="max-w-7xl mx-auto py-12 sm:py-20 px-4 sm:px-6 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-4 sm:mb-6">
        <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-500" />
      </div>
      <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-3 sm:mb-4">{title}</h2>
      <p className="text-white/60 max-w-md mx-auto text-sm sm:text-base px-4">This feature is coming soon. Follow TASKS.md for development progress.</p>
      <div className="mt-4 sm:mt-6 inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/5 border border-white/10 text-white/40 text-[10px] sm:text-xs">
        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-yellow-500 animate-pulse" />
        <span>In Development</span>
      </div>
    </div>
  )

  const StepIndicator = ({ current, total }: { current: number; total: number }) => (
    <div className="flex items-center justify-center gap-1 sm:gap-2 mb-4 sm:mb-6">
      {Array.from({ length: total }).map((_, i) => {
        const stepNum = i + 1
        const isActive = stepNum === current
        const isCompleted = stepNum < current
        return (
          <div key={i} className="flex items-center">
            <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold transition-all ${
              isActive ? "bg-yellow-500 text-[#022c16]" : 
              isCompleted ? "bg-emerald-500 text-white" : 
              "bg-white/10 text-white/40"
            }`}>
              {isCompleted ? <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" /> : stepNum}
            </div>
            {i < total - 1 && (
              <div className={`w-6 sm:w-12 h-0.5 transition-all ${
                isCompleted ? "bg-emerald-500" : "bg-white/10"
              }`} />
            )}
          </div>
        )
      })}
    </div>
  )

  return (
    <div className="min-h-screen bg-[#022c16] text-white flex flex-col font-sans">
      
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
      
      {/* HEADER - Responsive */}
      <header className="border-b border-white/10 bg-[#022c16]/90 sticky top-0 z-40 shadow-lg py-3 px-4 sm:py-3.5 sm:px-6 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3 select-none">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center text-[#022c16] shadow-md shadow-yellow-500/15">
              <BookOpen className="w-4 h-4 sm:w-5.5 sm:h-5.5" />
            </div>
            <div className="hidden xs:block">
              <h1 className="font-serif font-bold text-sm sm:text-lg text-white leading-tight">National Ta'lim-ul-Qur'an</h1>
              <p className="font-mono text-[7px] sm:text-[9px] text-yellow-500 uppercase tracking-wider font-bold">Waqf-e-Ardhi &amp; Quran Education</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex flex-wrap items-center gap-1.5 md:gap-2.5 text-xs sm:text-sm">
            <button onClick={() => handleNavClick("home")} className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 cursor-pointer ${activeTab === "home" ? "bg-gradient-to-r from-yellow-500 to-yellow-400 text-[#022c16] font-bold shadow-md shadow-yellow-500/15" : "text-white/70 hover:text-white hover:bg-white/5"}`}>Home</button>
            
            <div 
              className="relative"
              onMouseEnter={() => setShowClassesDropdown(true)}
              onMouseLeave={() => setShowClassesDropdown(false)}
            >
              <button 
                className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                  activeTab === "talim" || activeTab === "talim-tarjuma" || activeTab === "talim-tajweed" || activeTab === "talim-yassarnal"
                    ? "bg-gradient-to-r from-yellow-500 to-yellow-400 text-[#022c16] font-bold shadow-md shadow-yellow-500/15" 
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
                onClick={() => handleNavClick("talim")}
              >
                Ta'lim Classes
                <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 opacity-60" />
              </button>
              
              {showClassesDropdown && (
                <div className="absolute top-full left-0 mt-1 w-48 sm:w-52 bg-[#022c16] border border-white/10 rounded-xl shadow-lg py-2 z-50">
                  {[
                    { label: "📚 All Classes", tab: "talim" },
                    { label: "📖 Tarjuma (Translation)", tab: "talim-tarjuma" },
                    { label: "🎙️ Tajweed (Pronunciation)", tab: "talim-tajweed" },
                    { label: "📖 Yassarnal Quran (Qaida)", tab: "talim-yassarnal" }
                  ].map((item) => (
                    <button 
                      key={item.tab}
                      className="block w-full text-left px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all"
                      onClick={() => { setShowClassesDropdown(false); handleNavClick(item.tab); }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <button onClick={() => handleNavClick("admission")} className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 cursor-pointer ${activeTab === "admission" ? "bg-gradient-to-r from-yellow-500 to-yellow-400 text-[#022c16] font-bold shadow-md shadow-yellow-500/15" : "text-white/70 hover:text-white hover:bg-white/5"}`}>ITQA</button>
            <button onClick={() => handleNavClick("learning")} className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg font-semibold transition-all text-white/70 hover:text-white hover:bg-white/5 cursor-pointer">Arabic</button>
            <button onClick={() => setShowHufaazModal(true)} className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg font-semibold transition-all text-white/70 hover:text-white hover:bg-white/5 cursor-pointer">Hufaaz DB</button>
            <button onClick={() => setShowSchoolsModal(true)} className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg font-semibold transition-all text-white/70 hover:text-white hover:bg-white/5 cursor-pointer">Tahfiz</button>
            <button onClick={() => handleNavClick("devotion")} className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg font-semibold transition-all text-white/70 hover:text-white hover:bg-white/5 cursor-pointer">Waqf</button>
            <button className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg font-semibold transition-all text-white/70 hover:text-white hover:bg-white/5 cursor-pointer">Board</button>
            <button onClick={() => handleNavClick("learning")} className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg font-semibold transition-all text-white/70 hover:text-white hover:bg-white/5 cursor-pointer">Resources</button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 sm:p-2 rounded-lg hover:bg-white/5 text-white/70 hover:text-white transition-colors"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-white/10 space-y-1">
            <button onClick={() => handleNavClick("home")} className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === "home" ? "bg-yellow-500/10 text-yellow-500" : "text-white/70 hover:text-white hover:bg-white/5"}`}>Home</button>
            
            <div className="relative">
              <button 
                onClick={() => setShowClassesDropdown(!showClassesDropdown)}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-between ${activeTab === "talim" || activeTab === "talim-tarjuma" || activeTab === "talim-tajweed" || activeTab === "talim-yassarnal" ? "bg-yellow-500/10 text-yellow-500" : "text-white/70 hover:text-white hover:bg-white/5"}`}
              >
                Ta'lim Classes
                <ChevronDown className={`w-4 h-4 transition-transform ${showClassesDropdown ? "rotate-180" : ""}`} />
              </button>
              {showClassesDropdown && (
                <div className="pl-4 space-y-1">
                  {[
                    { label: "📚 All Classes", tab: "talim" },
                    { label: "📖 Tarjuma (Translation)", tab: "talim-tarjuma" },
                    { label: "🎙️ Tajweed (Pronunciation)", tab: "talim-tajweed" },
                    { label: "📖 Yassarnal Quran (Qaida)", tab: "talim-yassarnal" }
                  ].map((item) => (
                    <button 
                      key={item.tab}
                      className="block w-full text-left px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all"
                      onClick={() => { setShowClassesDropdown(false); handleNavClick(item.tab); }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <button onClick={() => handleNavClick("admission")} className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === "admission" ? "bg-yellow-500/10 text-yellow-500" : "text-white/70 hover:text-white hover:bg-white/5"}`}>ITQA Registration</button>
            <button onClick={() => handleNavClick("learning")} className="block w-full text-left px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5">Arabic</button>
            <button onClick={() => setShowHufaazModal(true)} className="block w-full text-left px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5">Hufaaz DB</button>
            <button onClick={() => setShowSchoolsModal(true)} className="block w-full text-left px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5">Madrasatu Tahfiz</button>
            <button onClick={() => handleNavClick("devotion")} className="block w-full text-left px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5">Waqf-e-Ardhi</button>
            <button className="block w-full text-left px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5">Board</button>
            <button onClick={() => handleNavClick("learning")} className="block w-full text-left px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5">Resources</button>
          </div>
        )}
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1">
        
        {/* HOME TAB */}
        {activeTab === "home" && (
          <>
            {/* HERO SECTION - Responsive */}
            <section className="relative flex items-center py-12 sm:py-16 md:py-20 px-4 sm:px-6 overflow-hidden min-h-[400px] sm:min-h-[500px] border-b border-white/10">
              <div 
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{ 
                  backgroundImage: "url('/mosque.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }}
              />
              <div className="absolute inset-0 bg-[#022c16]/80 z-0" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#022c16] via-transparent to-transparent z-0 pointer-events-none" />
              
              <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
                <div className="lg:col-span-7 flex flex-col items-start text-left">
                  <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4 sm:mb-6 leading-[1.15]">
                    <span className="text-yellow-500">WAQF-E-ARDHI</span>
                    <br />
                    <span className="text-emerald-300">&amp; QURAN EDUCATION</span>
                  </h2>

                  <p className="font-serif text-base sm:text-lg md:text-xl text-white/90 mb-2 font-medium">
                    Uniting Quran Education and Waqf Management for a <span className="text-yellow-400">Stronger Ummah.</span>
                  </p>

                  <p className="font-sans text-sm sm:text-base text-white/70 max-w-2xl mb-6 sm:mb-8 leading-relaxed">
                    A secure, transparent and accountable system for managing Quran schools, classes, Hufaaz records and Waqf-e-Ardhi (land endowments) across Nigeria.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-8 sm:mb-12">
                    <Button onClick={() => handleNavClick("admission")} variant="primary" size="sm" className="sm:size-md lg:size-lg">
                      Register / Enroll Now <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button onClick={() => handleNavClick("learning")} variant="secondary" size="sm" className="sm:size-md lg:size-lg">
                      Explore Learning Resources <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/50" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 w-full">
                    <div onClick={() => handleNavClick("learning")} className="p-2 sm:p-3.5 rounded-xl bg-white/5 border border-white/10 shadow-md hover:border-yellow-500/40 hover:bg-white/10 cursor-pointer transition-all">
                      <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 mb-1 sm:mb-2" />
                      <h3 className="font-sans font-bold text-[8px] sm:text-[11px] uppercase tracking-wide text-white leading-tight">QURAN LESSONS</h3>
                      <p className="text-[7px] sm:text-[10px] text-white/60 mt-0.5 sm:mt-1">Tajweed &amp; Qaida</p>
                    </div>
                    <div onClick={() => setShowHufaazModal(true)} className="p-2 sm:p-3.5 rounded-xl bg-white/5 border border-white/10 shadow-md hover:border-yellow-500/40 hover:bg-white/10 cursor-pointer transition-all">
                      <Award className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 mb-1 sm:mb-2" />
                      <h3 className="font-sans font-bold text-[8px] sm:text-[11px] uppercase tracking-wide text-white leading-tight">HUFAAZ TRACKING</h3>
                      <p className="text-[7px] sm:text-[10px] text-white/60 mt-0.5 sm:mt-1">Juz milestones</p>
                    </div>
                    <div onClick={() => handleNavClick("devotion")} className="p-2 sm:p-3.5 rounded-xl bg-white/5 border border-white/10 shadow-md hover:border-yellow-500/40 hover:bg-white/10 cursor-pointer transition-all">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 mb-1 sm:mb-2" />
                      <h3 className="font-sans font-bold text-[8px] sm:text-[11px] uppercase tracking-wide text-white leading-tight">WAQF-E-ARDHI</h3>
                      <p className="text-[7px] sm:text-[10px] text-white/60 mt-0.5 sm:mt-1">Dedicating time</p>
                    </div>
                    <div onClick={() => handleNavClick("admission")} className="p-2 sm:p-3.5 rounded-xl bg-white/5 border border-white/10 shadow-md hover:border-yellow-500/40 hover:bg-white/10 cursor-pointer transition-all">
                      <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 mb-1 sm:mb-2" />
                      <h3 className="font-sans font-bold text-[8px] sm:text-[11px] uppercase tracking-wide text-white leading-tight">STUDENT ENTRY</h3>
                      <p className="text-[7px] sm:text-[10px] text-white/60 mt-0.5 sm:mt-1">Online enrollment</p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 hidden lg:flex justify-end relative">
                  <motion.div initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="relative p-6 rounded-3xl bg-[#022c16]/80 backdrop-blur-md border border-white/10 shadow-2xl w-full max-w-[420px]">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                      <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-white/10" /><div className="w-2 h-2 rounded-full bg-white/10" /><div className="w-2 h-2 rounded-full bg-white/10" /></div>
                      <span className="text-[10px] font-mono text-white/40">federal_dashboard.ng</span>
                    </div>
                    <div className="space-y-4">
                      <div className="p-3 bg-white/5 border border-white/5 rounded-xl"><span className="text-[10px] text-white/50 uppercase font-bold block">ACTIVE HUFAAZ STUDENTS</span><div className="flex items-baseline gap-2 mt-1"><span className="text-xl sm:text-2xl font-sans font-bold text-yellow-500">45,781</span><span className="text-xs text-emerald-400 font-semibold flex items-center"><TrendingUp className="w-3 h-3 mr-1" /> +12%</span></div></div>
                      <div className="p-3 bg-white/5 border border-white/5 rounded-xl"><span className="text-[10px] text-white/50 uppercase font-bold block">REGISTERED WAQF PARCELS</span><div className="flex items-baseline gap-2 mt-1"><span className="text-xl sm:text-2xl font-sans font-bold text-white">2,356</span><span className="text-xs text-white/60 font-semibold font-mono">12,842.75 Ha</span></div></div>
                      <div className="p-3 bg-white/5 border border-white/5 rounded-xl"><span className="text-[10px] text-white/50 uppercase font-bold block font-mono">FEDERAL TRUST AUDIT</span><div className="flex items-center gap-2 mt-2 text-xs text-yellow-500 font-bold"><ShieldCheck className="w-4 h-4 text-yellow-500" /><span>100% Verified</span></div></div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* OUR KEY SERVICES - Responsive */}
            <section className="py-12 sm:py-16 px-4 sm:px-6 bg-[#011f0f] border-b border-white/10">
              <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <span className="text-[10px] sm:text-xs font-mono text-yellow-500 font-bold uppercase tracking-widest">OUR KEY SERVICES</span>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white tracking-tight">What We Offer</h3>
                  <div className="w-12 sm:w-16 h-1 bg-gradient-to-r from-yellow-500 to-yellow-400 mx-auto rounded-full" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {[{ title: "ITQA Accreditation", icon: GraduationCap, desc: "Register as a certified teacher or student through our streamlined accreditation process.", action: "Register Now", tab: "admission" }, { title: "Ta'lim Classes", icon: BookOpen, desc: "Join Tafsir, Tajweed, and Tarjumat classes with experienced instructors.", action: "Find Classes", tab: "learning" }, { title: "Tahfiz Schools", icon: MapPin, desc: "Explore our national registry of certified Madrasas and Quranic hubs.", action: "View Schools", tab: "schools" }, { title: "Waqf-e-Ardhi", icon: Building2, desc: "Contribute to our physical land endowment program for building local Quranic schools.", action: "Learn More", tab: "devotion" }].map((item, i) => (
                    <Card key={i} hover className="flex flex-col items-start text-left p-4 sm:p-6">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/10 text-yellow-500 flex items-center justify-center mb-4 sm:mb-6 transition-transform group-hover:scale-110"><item.icon className="w-5 h-5 sm:w-6 sm:h-6" /></div>
                      <h4 className="text-base sm:text-lg font-serif font-bold text-white mb-1 sm:mb-2">{item.title}</h4>
                      <p className="text-xs text-white/70 leading-relaxed mb-4 sm:mb-6 flex-grow">{item.desc}</p>
                      <Button variant="ghost" onClick={() => { if (item.tab === "schools") setShowSchoolsModal(true); else handleNavClick(item.tab); }} className="text-xs text-yellow-500 hover:text-yellow-400 font-bold p-0">
                        {item.action} <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </Button>
                    </Card>
                  ))}
                </div>
              </div>
            </section>

            {/* OUR MISSION - Responsive */}
            <section className="py-12 sm:py-16 px-4 sm:px-6 bg-[#022c16]/50">
              <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
                <div className="text-center max-w-2xl mx-auto">
                  <span className="text-[10px] sm:text-xs font-mono text-yellow-500 font-bold uppercase tracking-widest">OUR MISSION</span>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-white mt-2">Comprehensive Education and Physical Endowment</h3>
                  <p className="text-sm text-white/70 mt-3 max-w-2xl mx-auto px-2">
                    Managing spiritual learning alongside temporal endowments to build a highly structured, self-sustaining educational environment.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                  <div className="p-4 sm:p-6 bg-white/5 border border-white/10 rounded-2xl shadow-md space-y-3 sm:space-y-4 hover:border-yellow-500/25 hover:bg-white/[0.08] transition-all">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/10 flex items-center justify-center text-yellow-500">
                      <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <h4 className="text-base sm:text-lg font-bold font-serif text-white">Ta'lim-ul-Qur'an Curriculum</h4>
                    <p className="text-xs text-white/70 leading-relaxed">
                      Syllabus integration across Madrasas ensuring proper rules of Tajweed and understanding. Students progress from introductory Qaida to advanced Hifz.
                    </p>
                    <button onClick={() => handleNavClick("learning")} className="text-xs text-yellow-500 hover:text-yellow-400 flex items-center gap-1.5 font-bold pt-2 cursor-pointer transition-all hover:gap-2">
                      <span>Access Learning Resources</span>
                      <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </button>
                  </div>

                  <div className="p-4 sm:p-6 bg-white/5 border border-white/10 rounded-2xl shadow-md space-y-3 sm:space-y-4 hover:border-yellow-500/25 hover:bg-white/[0.08] transition-all">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/10 flex items-center justify-center text-yellow-500">
                      <Globe className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <h4 className="text-base sm:text-lg font-bold font-serif text-white">Waqf-e-Ardhi Devotion</h4>
                    <p className="text-xs text-white/70 leading-relaxed">
                      A unique devotion scheme where volunteers dedicate their personal time (ranging from 3 to 30 days) to travel to regional centers and teach Holy Quran rules.
                    </p>
                    <button onClick={() => handleNavClick("devotion")} className="text-xs text-yellow-500 hover:text-yellow-400 flex items-center gap-1.5 font-bold pt-2 cursor-pointer transition-all hover:gap-2">
                      <span>Submit Devotion Request</span>
                      <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </button>
                  </div>

                  <div className="p-4 sm:p-6 bg-white/5 border border-white/10 rounded-2xl shadow-md space-y-3 sm:space-y-4 hover:border-yellow-500/25 hover:bg-white/[0.08] transition-all">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/10 flex items-center justify-center text-yellow-500">
                      <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <h4 className="text-base sm:text-lg font-bold font-serif text-white">Student Academy Entry</h4>
                    <p className="text-xs text-white/70 leading-relaxed">
                      Parents can apply online to register their wards in certified Quran Schools across Nigerian States. Admission requests are evaluated and integrated into the Central Registry.
                    </p>
                    <button onClick={() => handleNavClick("admission")} className="text-xs text-yellow-500 hover:text-yellow-400 flex items-center gap-1.5 font-bold pt-2 cursor-pointer transition-all hover:gap-2">
                      <span>Apply for Admission</span>
                      <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* TA'LIM CLASSES TABS */}
        {activeTab === "talim" && <TaLimClassesContent />}
        {activeTab === "talim-tarjuma" && <TaLimClassesContent type="tarjuma" />}
        {activeTab === "talim-tajweed" && <TaLimClassesContent type="tajweed" />}
        {activeTab === "talim-yassarnal" && <TaLimClassesContent type="yassarnal" />}

        {/* LEARNING TAB - Coming Soon */}
        {activeTab === "learning" && <ComingSoon title="Ta'lim Classes & Learning Resources" icon={BookOpen} />}

        {/* DEVOTION TAB - Coming Soon */}
        {activeTab === "devotion" && <ComingSoon title="Waqf-e-Ardhi Devotion" icon={Heart} />}

        {/* ADMISSION TAB - ITQA Registration (Responsive) */}
        {activeTab === "admission" && (
          <div className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 space-y-8 sm:space-y-12">
            <div className="border-b border-white/10 pb-4 sm:pb-6">
              <span className="text-[10px] sm:text-xs font-mono text-yellow-500 font-bold uppercase tracking-widest">ITQA ACCREDITATION BUREAU</span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">ITQA National Registration Portal</h2>
              <p className="text-sm text-white/70 mt-2">Register as a student or apply for teacher accreditation under the National Ta'lim-ul-Qur'an Board.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
              <div className="lg:col-span-5">
                <Card className="p-4 sm:p-6">
                  <div><h3 className="text-base sm:text-lg font-serif font-bold text-white mb-2">Our Standardized Framework</h3><p className="text-xs text-white/70 leading-relaxed">The National Ta'lim-ul-Qur'an program operates a unified system of exams, resources, and progress tracking across all verified Madrasas.</p></div>
                  <div className="space-y-3 sm:space-y-4 mt-4 sm:mt-6">
                    <div className="p-3 sm:p-4 bg-[#011f0f]/50 rounded-2xl border border-white/10"><span className="text-xs font-bold text-yellow-500 block">Unified National Curricula</span><p className="text-[10px] sm:text-[11px] text-white/70 mt-1">Complete syllabus alignment for Qaida recitation, advanced Tajweed rules, and comprehensive Hifz levels with regular state testing cycles.</p></div>
                    <div className="p-3 sm:p-4 bg-[#011f0f]/50 rounded-2xl border border-white/10"><span className="text-xs font-bold text-yellow-500 block">Certified Educator Licenses</span><p className="text-[10px] sm:text-[11px] text-white/70 mt-1">Teachers are evaluated on their Tajweed rules and given formal Teaching Licenses. Verified certificates are visible in the National Ledger.</p></div>
                    <div className="p-3 sm:p-4 bg-[#011f0f]/50 rounded-2xl border border-white/10"><span className="text-xs font-bold text-yellow-500 block">Cryptographic ID Badges</span><p className="text-[10px] sm:text-[11px] text-white/70 mt-1">Every accredited user is issued a cryptographic ID linking them securely to their respective regional state center.</p></div>
                  </div>
                  <div className="p-3 sm:p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3 mt-4"><Award className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 shrink-0" /><div><span className="text-xs font-bold text-yellow-500 block">ITQA Official Recognition</span><p className="text-[10px] text-white/70">Acclimatizing students and educators with modern certifications recognized across global Islamic learning hubs.</p></div></div>
                </Card>
              </div>

              <div className="lg:col-span-7">
                <Card className="p-4 sm:p-6">
                  {success ? (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-8 sm:py-12 text-center">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center mx-auto text-emerald-400 mb-4"><CheckCircle className="w-6 h-6 sm:w-10 sm:h-10" /></div>
                      <h4 className="text-lg sm:text-xl text-emerald-400 font-bold">Registration Submitted Successfully!</h4>
                      <p className="text-white/60 text-sm mt-2 max-w-sm mx-auto px-2">Your {registrationRole} registration has been received. Redirecting to login...</p>
                      <div className="mt-6 w-full bg-white/5 rounded-full h-1 overflow-hidden">
                        <div className="bg-gradient-to-r from-yellow-500 to-emerald-400 h-full rounded-full animate-pulse" style={{ width: "100%" }} />
                      </div>
                    </motion.div>
                  ) : (
                    <>
                      <h3 className="text-base sm:text-xl font-serif font-bold text-white mb-4 border-b border-white/10 pb-3">{registrationRole === "student" ? "Student Enrollment Application" : "Teacher Accreditation Request"}</h3>

                      <div className="flex flex-col xs:flex-row bg-white/5 p-1 rounded-2xl gap-1 sm:gap-2 border border-white/10 shadow-lg mb-4 sm:mb-6">
                        <Button 
                          variant={registrationRole === "student" ? "primary" : "ghost"} 
                          size="sm" 
                          className="flex-1 text-xs sm:text-sm"
                          onClick={() => { setRegistrationRole("student"); setStep(1); setError(""); }}
                        >
                          <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> Student
                        </Button>
                        <Button 
                          variant={registrationRole === "teacher" ? "primary" : "ghost"} 
                          size="sm" 
                          className="flex-1 text-xs sm:text-sm"
                          onClick={() => { setRegistrationRole("teacher"); setStep(1); setError(""); }}
                        >
                          <UserCheck className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> Teacher
                        </Button>
                      </div>

                      <StepIndicator current={step} total={3} />

                      <form onSubmit={handleRegistrationSubmit} className="space-y-4">
                        {error && (
                          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{error}</span>
                          </div>
                        )}

                        {step === 1 && (
                          <div className="space-y-4">
                            {registrationRole === "student" ? (
                              <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                  <Input name="parentName" label="Parent/Guardian Full Name" placeholder="e.g. Alhaji Babandida Musa" value={formData.parentName} onChange={handleInputChange} required />
                                  <Input name="phone" label="Phone Number" placeholder="+234 803 111 2222" value={formData.phone} onChange={handleInputChange} required />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                  <Input name="email" label="Email Address" type="email" placeholder="parent@example.com" value={formData.email} onChange={handleInputChange} required />
                                  <Select name="state" label="State of Residence" value={formData.state} onChange={handleInputChange} options={[{ value: "Kano", label: "Kano" }, { value: "Oyo", label: "Oyo" }, { value: "FCT (Abuja)", label: "FCT (Abuja)" }, { value: "Kaduna", label: "Kaduna" }, { value: "Kwara", label: "Kwara" }, { value: "Borno", label: "Borno" }, { value: "Lagos", label: "Lagos" }]} />
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                  <Input name="teacherName" label="Full Name (Ustadh/Ustadha)" placeholder="e.g. Ustadh Abdul-Hameed" value={formData.teacherName} onChange={handleInputChange} required />
                                  <Input name="phone" label="Phone Number" placeholder="+234 803 222 3333" value={formData.phone} onChange={handleInputChange} required />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                  <Input name="email" label="Email Address" type="email" placeholder="teacher@example.com" value={formData.email} onChange={handleInputChange} required />
                                  <Select name="state" label="State of Residence" value={formData.state} onChange={handleInputChange} options={[{ value: "Kano", label: "Kano" }, { value: "Oyo", label: "Oyo" }, { value: "FCT (Abuja)", label: "FCT (Abuja)" }, { value: "Kaduna", label: "Kaduna" }, { value: "Kwara", label: "Kwara" }, { value: "Borno", label: "Borno" }, { value: "Lagos", label: "Lagos" }]} />
                                </div>
                              </>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                              <Input name="password" label="Password (min 6)" type="password" placeholder="Create a password" value={formData.password} onChange={handleInputChange} required />
                              <Input name="confirmPassword" label="Confirm Password" type="password" placeholder="Confirm password" value={formData.confirmPassword} onChange={handleInputChange} required />
                            </div>

                            <div className="flex justify-end pt-4">
                              <Button variant="primary" size="sm" onClick={() => { if (formData.password && formData.confirmPassword && formData.password === formData.confirmPassword && formData.password.length >= 6) { setStep(2); } else { setError("Please set a valid password (min 6 characters and matching)"); } }}>
                                Next: Credentials <ArrowRight className="w-3.5 h-3.5 ml-2" />
                              </Button>
                            </div>
                          </div>
                        )}

                        {step === 2 && (
                          <div className="space-y-4">
                            {registrationRole === "student" ? (
                              <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                  <Input name="studentName" label="Student's Full Name" placeholder="e.g. Zainab Babandida" value={formData.studentName} onChange={handleInputChange} required />
                                  <Input name="age" label="Age" type="number" placeholder="e.g. 10" value={formData.age} onChange={handleInputChange} required />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                  <Select name="gender" label="Gender" value={formData.gender} onChange={handleInputChange} options={[{ value: "Male", label: "Male" }, { value: "Female", label: "Female" }]} />
                                  <Select name="previousKnowledge" label="Previous Knowledge" value={formData.previousKnowledge} onChange={handleInputChange} options={[{ value: "No Knowledge (Complete Beginner)", label: "No Knowledge (Complete Beginner)" }, { value: "Yassarnal Quran Complete", label: "Yassarnal Quran Complete" }, { value: "Can read Arabic text fluently", label: "Can read Arabic text fluently" }, { value: "1-2 Juz memorized", label: "1-2 Juz memorized" }]} />
                                </div>
                                <Select name="preferredSchool" label="Preferred School" value={formData.preferredSchool} onChange={handleInputChange} options={[{ value: "Al-Furqan Model School, Kano", label: "Al-Furqan Model School, Kano" }, { value: "Darul Qur'an Academy, Ibadan", label: "Darul Qur'an Academy, Ibadan" }, { value: "Gwagwalada Central Islamic Hub", label: "Gwagwalada Central Islamic Hub" }, { value: "Markazul Qur'an Al-Karim, Kaduna", label: "Markazul Qur'an Al-Karim, Kaduna" }]} />
                              </>
                            ) : (
                              <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                  <Select name="specialization" label="Teaching Specialization" value={formData.specialization} onChange={handleInputChange} options={[{ value: "Foundation Classes (Qaida)", label: "Foundation Classes (Qaida)" }, { value: "Tajweed Pronunciation", label: "Tajweed Pronunciation" }, { value: "Advanced Tafsir & Translation", label: "Advanced Tafsir & Translation" }, { value: "Hifz Mentorship", label: "Hifz Mentorship" }]} />
                                  <Input name="experience" label="Years of Experience" type="number" placeholder="e.g. 3" value={formData.experience} onChange={handleInputChange} required />
                                </div>
                                <Select name="qualification" label="Teaching Qualification" value={formData.qualification} onChange={handleInputChange} options={[{ value: "Full Hifz-ul-Quran (Certified Hafiz)", label: "Full Hifz-ul-Quran (Certified Hafiz)" }, { value: "Tajweed Certification License", label: "Tajweed Certification License" }, { value: "Intermediate Reciter Level", label: "Intermediate Reciter Level" }, { value: "Half Quran Hifz (15 Juz)", label: "Half Quran Hifz (15 Juz)" }]} />
                              </>
                            )}
                            <div className="flex flex-col xs:flex-row justify-between gap-2 pt-4">
                              <Button variant="secondary" size="sm" onClick={() => setStep(1)} className="w-full xs:w-auto">Back</Button>
                              <Button variant="primary" size="sm" onClick={() => setStep(3)} className="w-full xs:w-auto">Review & Submit <ArrowRight className="w-3.5 h-3.5 ml-2" /></Button>
                            </div>
                          </div>
                        )}

                        {step === 3 && (
                          <div className="space-y-4">
                            <div className="p-4 sm:p-5 bg-[#011f0f]/50 border border-white/10 rounded-2xl space-y-4">
                              <h4 className="text-xs font-mono font-bold uppercase text-yellow-500 border-b border-white/10 pb-2">Review Your Information</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs text-white/70">
                                {registrationRole === "student" ? (
                                  <>
                                    <div><span className="text-white/40 block text-[9px] uppercase font-mono">Student Name</span><span className="text-white font-bold">{formData.studentName || "Not provided"}</span></div>
                                    <div><span className="text-white/40 block text-[9px] uppercase font-mono">Age & Gender</span><span className="text-white">{formData.age || "Not provided"} • {formData.gender}</span></div>
                                    <div className="sm:col-span-2"><span className="text-white/40 block text-[9px] uppercase font-mono">Guardian</span><span className="text-white">{formData.parentName || "Not provided"}</span></div>
                                    <div className="sm:col-span-2"><span className="text-white/40 block text-[9px] uppercase font-mono">Previous Knowledge</span><span className="text-white">{formData.previousKnowledge}</span></div>
                                  </>
                                ) : (
                                  <>
                                    <div><span className="text-white/40 block text-[9px] uppercase font-mono">Teacher Name</span><span className="text-white font-bold">{formData.teacherName || "Not provided"}</span></div>
                                    <div><span className="text-white/40 block text-[9px] uppercase font-mono">Experience</span><span className="text-white">{formData.experience || "Not provided"} years</span></div>
                                    <div className="sm:col-span-2"><span className="text-white/40 block text-[9px] uppercase font-mono">Specialization</span><span className="text-white">{formData.specialization || "Not provided"}</span></div>
                                    <div className="sm:col-span-2"><span className="text-white/40 block text-[9px] uppercase font-mono">Qualification</span><span className="text-white">{formData.qualification || "Not provided"}</span></div>
                                  </>
                                )}
                                <div className="sm:col-span-2 border-t border-white/10 pt-2 mt-1">
                                  <span className="text-white/40 block text-[9px] uppercase font-mono">Contact & Location</span>
                                  <span className="text-white">{formData.phone || "Not provided"} • {formData.email || "Not provided"} • {formData.state}</span>
                                </div>
                              </div>
                            </div>
                            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 rounded-xl text-[10px] font-sans flex items-start gap-2">
                              <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 mt-0.5" />
                              <span>By submitting, you confirm that all information provided is accurate and complete.</span>
                            </div>
                            <div className="flex flex-col xs:flex-row justify-between gap-2 pt-4">
                              <Button variant="secondary" size="sm" onClick={() => setStep(2)} className="w-full xs:w-auto">Back to Edit</Button>
                              <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting} className="w-full xs:w-auto flex-1">
                                {isSubmitting ? "Submitting..." : <><CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2" />Submit {registrationRole === "student" ? "Enrollment" : "Accreditation"}</>}
                              </Button>
                            </div>
                          </div>
                        )}
                      </form>
                    </>
                  )}
                </Card>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* FOOTER - Responsive */}
      <footer className="border-t border-white/10 bg-black/40 px-4 sm:px-6 py-6 sm:py-8 mt-8 sm:mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-emerald-950 flex items-center justify-center border border-white/10"><BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" /></div>
            <div>
              <h4 className="font-display font-semibold text-[10px] sm:text-xs uppercase tracking-wide text-white">TA'LIM-UL-QUR'AN NIGERIA</h4>
              <p className="text-[9px] sm:text-[11px] text-white/50">Unified Waqf-e-Ardhi & Quran Memorization Tracking</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-white/50 justify-center">
            <button onClick={() => handleNavClick("home")} className="hover:text-white transition-colors">Home</button>
            <button onClick={() => handleNavClick("learning")} className="hover:text-white transition-colors">Resources</button>
            <button onClick={() => handleNavClick("devotion")} className="hover:text-white transition-colors">Waqf Form</button>
            <button onClick={() => handleNavClick("admission")} className="hover:text-white transition-colors">Admissions</button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/5">
          <p className="text-[10px] sm:text-[11px] text-white/30 text-center">© 2026 National Ta'lim-ul-Qur'an & Waqf-e-Ardhi Management Platform. All rights reserved.</p>
          <Button variant="ghost" size="sm" className="text-[10px] sm:text-[11px] text-white/40 hover:text-white">
            <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-500 mr-1 sm:mr-1.5" /> Admin Portal
          </Button>
        </div>
      </footer>

      {/* MODALS - Responsive */}
      <Modal isOpen={showHufaazModal} onClose={() => setShowHufaazModal(false)} title="Hufaaz Database" size="md">
        <div className="text-center py-4">
          <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-yellow-50 border border-yellow-200 flex items-center justify-center mx-auto mb-4 sm:mb-6"><Award className="w-8 h-8 sm:w-12 sm:h-12 text-yellow-500" /></div>
          <p className="text-sm text-gray-500 max-w-sm mx-auto px-2">This feature is currently under development. The Hufaaz registry will be available soon.</p>
          <div className="mt-4 sm:mt-6 inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-yellow-50 border border-yellow-200 text-yellow-700 text-[10px] sm:text-xs font-medium"><div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-yellow-500 animate-pulse" /><span>In Development</span></div>
          <div className="mt-4 sm:mt-6 flex justify-end">
            <Button variant="secondary" onClick={() => setShowHufaazModal(false)}>Close</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showSchoolsModal} onClose={() => setShowSchoolsModal(false)} title="Madrasatu Tahfiz Directory" size="md">
        <div className="text-center py-4">
          <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-4 sm:mb-6"><Building2 className="w-8 h-8 sm:w-12 sm:h-12 text-emerald-600" /></div>
          <p className="text-sm text-gray-500 max-w-sm mx-auto px-2">This feature is currently under development. The schools directory will be available soon.</p>
          <div className="mt-4 sm:mt-6 inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] sm:text-xs font-medium"><div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse" /><span>In Development</span></div>
          <div className="mt-4 sm:mt-6 flex justify-end">
            <Button variant="secondary" onClick={() => setShowSchoolsModal(false)}>Close</Button>
          </div>
        </div>
      </Modal>

    </div>
  )
}