import { useParams } from "react-router-dom"
import { Card, Button } from "@/components/ui"

export function SchoolDetail() {
  const { id } = useParams()

  return (
    <div className="p-4">
      <Card>
        <h1 className="text-2xl font-serif font-bold text-white">School Detail</h1>
        <p className="text-white/60 mt-2">School ID: {id}</p>
        <p className="text-white/40 text-sm mt-4">This is a placeholder. The full school detail will show here.</p>
        <Button variant="secondary" className="mt-4" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </Card>
    </div>
  )
}
