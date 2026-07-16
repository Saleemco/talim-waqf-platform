import { Outlet } from "react-router-dom"

export function MainLayout() {
  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  )
}
