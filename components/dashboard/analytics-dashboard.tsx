"use client"

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

const DEFAULT_DATA: AnalyticsData = {
  pageViews: [0, 0, 0, 0, 0, 0, 0],
  sales: [0, 0, 0, 0, 0, 0, 0],
  userSessions: [0, 0, 0, 0, 0, 0, 0],
  conversionRate: 0,
  averageOrderValue: 0,
}

async function fetchAnalyticsData(): Promise<AnalyticsData> {
  try {
    // In a real application, this would fetch data from your analytics API
    // For now, we'll return mock data
    return {
      pageViews: [100, 150, 200, 180, 250, 300, 280],
      sales: [5, 8, 12, 10, 15, 20, 18],
      userSessions: [80, 120, 160, 140, 200, 240, 220],
      conversionRate: 2.5,
      averageOrderValue: 75.99,
    }
  } catch (error) {
    console.error("Error fetching analytics data:", error)
    return DEFAULT_DATA
  }
}

export function AnalyticsDashboard() {
  const { data, loading, error } = useCache<AnalyticsData>(
    "analytics",
    fetchAnalyticsData,
    5 * 60 * 1000 // 5 minutes cache
  )

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="p-4">
            <div className="h-20 animate-pulse bg-muted rounded" />
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-destructive">Error Loading Analytics</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {error.message || "Failed to load analytics data. Please try again later."}
          </p>
        </div>
      </Card>
    )
  }

  const analyticsData = data || DEFAULT_DATA

  const chartData = Array.from({ length: 7 }, (_, i) => ({
    name: `Day ${i + 1}`,
    pageViews: analyticsData.pageViews[i] || 0,
    sales: analyticsData.sales[i] || 0,
    sessions: analyticsData.userSessions[i] || 0,
  }))

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="p-4">
        <h3 className="text-lg font-semibold">Conversion Rate</h3>
        <p className="text-2xl font-bold">{analyticsData.conversionRate.toFixed(1)}%</p>
      </Card>
      <Card className="p-4">
        <h3 className="text-lg font-semibold">Average Order Value</h3>
        <p className="text-2xl font-bold">${analyticsData.averageOrderValue.toFixed(2)}</p>
      </Card>
      <Card className="p-4">
        <h3 className="text-lg font-semibold">Total Page Views</h3>
        <p className="text-2xl font-bold">
          {analyticsData.pageViews.reduce((a, b) => a + b, 0).toLocaleString()}
        </p>
      </Card>
      <Card className="p-4">
        <h3 className="text-lg font-semibold">Total Sales</h3>
        <p className="text-2xl font-bold">
          {analyticsData.sales.reduce((a, b) => a + b, 0).toLocaleString()}
        </p>
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