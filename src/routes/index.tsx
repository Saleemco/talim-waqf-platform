import { Routes, Route } from "react-router-dom"
import { Home } from "@/pages/Home"
import { Login } from "@/pages/Login"
import { Register } from "@/pages/Register"
import { TestSupabase } from "@/pages/TestSupabase"
import { ClassList } from "@/features/classes/pages/ClassList"
import { SchoolList } from "@/features/schools/pages/SchoolList"
import { DashboardLayout } from "@/components/layout/DashboardLayout"

export function AppRoutes() {
  console.log("🔴 AppRoutes rendering - SIMPLE VERSION")
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/test" element={<TestSupabase />} />

      {/* Admin Routes - DIRECT, no DashboardLayout wrapper */}
      <Route path="/classes" element={<ClassList />} />
      <Route path="/schools" element={<SchoolList />} />
    </Routes>
  )
}
