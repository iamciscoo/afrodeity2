import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { OrdersTable } from "@/components/dashboard/orders/orders-table"
import { OrdersTableToolbar } from "@/components/dashboard/orders/orders-table-toolbar"

export default async function OrdersPage() {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  const orders = await prisma.order.findMany({
    include: {
      user: true,
      orderItems: {
        include: {
          product: true,
        },
      },
      address: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
      </div>
      <div className="space-y-4">
        <OrdersTableToolbar />
        <OrdersTable orders={orders} />
      </div>
    </div>
  )
} 