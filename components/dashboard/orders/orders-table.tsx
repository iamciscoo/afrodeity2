"use client"

import { useState } from "react"
import Link from "next/link"
import { Order, User, OrderItem, Product, Address, OrderStatus } from "@prisma/client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { formatDate } from "@/lib/utils"

interface OrdersTableProps {
  orders: (Order & {
    user: User
    orderItems: (OrderItem & {
      product: Product
    })[]
    address: Address
  })[]
}

export function OrdersTable({ orders }: OrdersTableProps) {
  const [loading, setLoading] = useState<string | null>(null)

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      setLoading(orderId)
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error("Failed to update order status")
      }

      // Refresh the page to show updated data
      window.location.reload()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Items</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>{order.user.name || order.user.email}</TableCell>
              <TableCell>{formatDate(order.createdAt)}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    order.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-800"
                      : order.status === "PROCESSING"
                      ? "bg-blue-100 text-blue-800"
                      : order.status === "SHIPPED"
                      ? "bg-purple-100 text-purple-800"
                      : order.status === "DELIVERED"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                </span>
              </TableCell>
              <TableCell>${Number(order.total).toFixed(2)}</TableCell>
              <TableCell>{order.orderItems.length} items</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      disabled={loading === order.id}
                    >
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => updateOrderStatus(order.id, "PROCESSING")}
                      disabled={order.status !== "PENDING"}
                    >
                      Mark as Processing
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => updateOrderStatus(order.id, "SHIPPED")}
                      disabled={order.status !== "PROCESSING"}
                    >
                      Mark as Shipped
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => updateOrderStatus(order.id, "DELIVERED")}
                      disabled={order.status !== "SHIPPED"}
                    >
                      Mark as Delivered
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => updateOrderStatus(order.id, "CANCELLED")}
                      disabled={order.status === "DELIVERED" || order.status === "CANCELLED"}
                    >
                      Cancel Order
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 