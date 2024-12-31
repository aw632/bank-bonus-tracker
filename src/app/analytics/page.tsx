import { Metadata } from "next"
import AnalyticsDashboard from "@/components/AnalyticsDashboard"

export const metadata: Metadata = {
  title: "Analytics",
  description: "Track and analyze your bank bonus performance",
}

export default function AnalyticsPage() {
  return (
    <div className="hidden flex-col md:flex">
      <AnalyticsDashboard />
    </div>
  )
}
