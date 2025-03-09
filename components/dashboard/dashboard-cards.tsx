"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ShoppingBag, Users, DollarSign, AlertTriangle } from "lucide-react"

interface DashboardCardsProps {
  metrics: {
    totalOrders: number
    totalCustomers: number
    totalRevenue: number
    lowStockProducts: number
  }
}

export function DashboardCards({ metrics }: DashboardCardsProps) {
  const cards = [
    {
      title: "Total Orders",
      value: metrics.totalOrders,
      icon: ShoppingBag,
      description: "Total orders placed",
    },
    {
      title: "Total Customers",
      value: metrics.totalCustomers,
      icon: Users,
      description: "Registered customers",
    },
    {
      title: "Total Revenue",
      value: `$${metrics.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      description: "Total revenue generated",
    },
    {
      title: "Low Stock",
      value: metrics.lowStockProducts,
      icon: AlertTriangle,
      description: "Products with low stock",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
} 