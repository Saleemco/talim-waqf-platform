import { useParams, Link, useNavigate } from "react-router-dom"
import { BookOpen, Building2, Users, Calendar, ArrowLeft, Edit, Trash2, Clock } from "lucide-react"
import { Card, Badge, Spinner, Button } from "@/components/ui"
import { useClasses } from "../hooks/useClasses"
import { useState } from "react"
import { ClassForm } from "../components/ClassForm"

export function ClassDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [showEditForm, setShowEditForm] = useState(false)
  const [toast, setToast] = useState({ message: "", type: "success" as "success" | "error" | "info", isVisible: false })
  const { getClass, deleteClass } = useClasses()
  
  const { data: cls, isLoading, error } = getClass(id!)

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ message, type, isVisible: true })
    setTimeout(() => {
      setToast({ ...toast, isVisible: false })
    }, 3000)
  }

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete "${cls?.name}"?`)) {
      try {
        await deleteClass.mutateAsync(id!)
        showToast(`Class "${cls?.name}" deleted successfully`, "success")
        setTimeout(() => navigate("/classes"), 1500)
      } catch (error) {
        showToast("Failed to delete class", "error")
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !cls) {
    return (
      <Card className="text-center py-12">
        <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-4" />
        <h3 className="text-lg font-serif font-bold text-white mb-2">Class Not Found</h3>
        <p className="text-sm text-white/50">The class you're looking for doesn't exist.</p>
        <Link to="/classes">
          <Button variant="primary" className="mt-4">Back to Classes</Button>
        </Link>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/classes">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
          </Link>
          <h1 className="text-2xl font-serif font-bold text-white">{cls.name}</h1>
          <Badge variant={cls.status === "active" ? "success" : cls.status === "paused" ? "warning" : "danger"}>
            {cls.status}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowEditForm(true)}>
            <Edit className="w-4 h-4 mr-1.5" /> Edit
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 mr-1.5" /> Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="space-y-4">
            <div>
              <span className="text-xs text-white/40 font-mono uppercase tracking-wider">Class Code</span>
              <p className="text-lg font-mono text-yellow-500">{cls.code}</p>
            </div>
            {cls.description && (
              <div>
                <span className="text-xs text-white/40 font-mono uppercase tracking-wider">Description</span>
                <p className="text-white">{cls.description}</p>
              </div>
            )}
            {cls.school && (
              <div>
                <span className="text-xs text-white/40 font-mono uppercase tracking-wider">School</span>
                <div className="flex items-center gap-2 text-white">
                  <Building2 className="w-4 h-4 text-white/30" />
                  <span>{cls.school.name}</span>
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-white/40 font-mono uppercase tracking-wider">Type</span>
                <p className="text-white capitalize">{cls.type || "Not specified"}</p>
              </div>
              <div>
                <span className="text-xs text-white/40 font-mono uppercase tracking-wider">Level</span>
                <p className="text-white capitalize">{cls.level || "Not specified"}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="font-serif font-bold text-white mb-4">Class Details</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Users className="w-4 h-4 text-white/30" />
              <span className="text-white">Students: {cls.current_students || 0} / {cls.max_students || 0}</span>
            </div>
            {cls.room && (
              <div className="flex items-center gap-3 text-sm">
                <span className="text-white/30">Room:</span>
                <span className="text-white">{cls.room}</span>
              </div>
            )}
            {cls.schedule && (
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-4 h-4 text-white/30" />
                <span className="text-white">{typeof cls.schedule === 'string' ? cls.schedule : JSON.stringify(cls.schedule)}</span>
              </div>
            )}
            {cls.start_date && (
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-white/30" />
                <span className="text-white">Start: {new Date(cls.start_date).toLocaleDateString()}</span>
              </div>
            )}
            {cls.end_date && (
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-white/30" />
                <span className="text-white">End: {new Date(cls.end_date).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </Card>
      </div>

      <ClassForm
        isOpen={showEditForm}
        onClose={() => setShowEditForm(false)}
        editingClass={cls}
        onSuccess={() => {
          setShowEditForm(false)
          showToast("Class updated successfully", "success")
        }}
      />
    </div>
  )
}