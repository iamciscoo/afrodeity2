import { Card } from "@/components/ui/card"
import { useCache } from "@/hooks/use-cache"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface AnalyticsData {
  pageViews: number[]
  sales: number[]
  userSessions: number[]
  conversionRate: number
  averageOrderValue: number
}

async function fetchAnalyticsData(): Promise<AnalyticsData> {
  // In a real application, this would fetch data from your analytics API
  // For now, we'll return mock data
  return {
    pageViews: [100, 150, 200, 180, 250, 300, 280],
    sales: [5, 8, 12, 10, 15, 20, 18],
    userSessions: [80, 120, 160, 140, 200, 240, 220],
    conversionRate: 2.5,
    averageOrderValue: 75.99,
  }
}

export function AnalyticsDashboard() {
  const { data, loading, error } = useCache<AnalyticsData>(
    "analytics",
    fetchAnalyticsData,
    5 * 60 * 1000 // 5 minutes cache
  )

  if (loading) return <div>Loading analytics...</div>
  if (error) return <div>Error loading analytics</div>
  if (!data) return null

  const chartData = Array.from({ length: 7 }, (_, i) => ({
    name: `Day ${i + 1}`,
    pageViews: data.pageViews[i],
    sales: data.sales[i],
    sessions: data.userSessions[i],
  }))

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="p-4">
        <h3 className="text-lg font-semibold">Conversion Rate</h3>
        <p className="text-2xl font-bold">{data.conversionRate}%</p>
      </Card>
      <Card className="p-4">
        <h3 className="text-lg font-semibold">Average Order Value</h3>
        <p className="text-2xl font-bold">${data.averageOrderValue}</p>
      </Card>
      <Card className="p-4">
        <h3 className="text-lg font-semibold">Total Page Views</h3>
        <p className="text-2xl font-bold">
          {data.pageViews.reduce((a, b) => a + b, 0)}
        </p>
      </Card>
      <Card className="p-4">
        <h3 className="text-lg font-semibold">Total Sales</h3>
        <p className="text-2xl font-bold">{data.sales.reduce((a, b) => a + b, 0)}</p>
      </Card>
      <Card className="col-span-full p-4">
        <h3 className="mb-4 text-lg font-semibold">Analytics Overview</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="pageViews"
                stroke="#8884d8"
                name="Page Views"
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#82ca9d"
                name="Sales"
              />
              <Line
                type="monotone"
                dataKey="sessions"
                stroke="#ffc658"
                name="Sessions"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
} 