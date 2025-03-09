import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { AnalyticsDashboard } from "@/components/dashboard/analytics-dashboard"

export default async function AnalyticsPage() {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
      </div>
      <div className="space-y-4">
        <AnalyticsDashboard />
      </div>
    </div>
  )
} 