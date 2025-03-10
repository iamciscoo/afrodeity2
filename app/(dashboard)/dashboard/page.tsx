import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { DashboardCards } from "@/components/dashboard/dashboard-cards"
import { RecentOrders } from "@/components/dashboard/recent-orders"
import { RecentCustomers } from "@/components/dashboard/recent-customers"
import { SalesChart } from "@/components/dashboard/sales-chart"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  // Get key metrics
  const [
    totalOrders,
    totalCustomers,
    totalRevenue,
    lowStockProducts,
    recentOrders,
    recentCustomers,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.aggregate({
      _sum: {
        total: true,
      },
    }),
    prisma.product.count({
      where: {
        stock: {
          lte: 10,
        },
      },
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    }),
    prisma.user.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        orders: true,
      },
    }),
  ])

  const metrics = {
    totalOrders,
    totalCustomers,
    totalRevenue: Number(totalRevenue._sum.total || 0),
    lowStockProducts,
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="space-y-4">
        <DashboardCards metrics={metrics} />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <SalesChart className="col-span-4" />
          <div className="col-span-3 space-y-4">
            <RecentOrders orders={recentOrders} />
            <RecentCustomers customers={recentCustomers} />
          </div>
        </div>
      </div>
    </div>
  )
} 