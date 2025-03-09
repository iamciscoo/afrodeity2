"use client"

import Link from "next/link"
import { Order, User, OrderItem, Product } from "@prisma/client"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface RecentOrdersProps {
  orders: (Order & {
    user: User
    items: (OrderItem & {
      product: Product
    })[]
  })[]
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order.id} className="flex items-center">
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {order.user.name || order.user.email}
                </p>
                <p className="text-sm text-muted-foreground">
                  {order.items.length} item{order.items.length === 1 ? "" : "s"}
                </p>
              </div>
              <div className="ml-auto font-medium">
                ${Number(order.total).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <Link
            href="/dashboard/orders"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            View all orders
          </Link>
        </div>
      </CardContent>
    </Card>
  )
} 