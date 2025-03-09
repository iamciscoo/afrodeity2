import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { OrderStatus } from "@prisma/client"

export async function PATCH(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const session = await auth()

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { status } = body

    if (!status || !Object.values(OrderStatus).includes(status)) {
      return new NextResponse("Invalid status", { status: 400 })
    }

    const order = await prisma.order.findUnique({
      where: {
        id: params.orderId,
      },
    })

    if (!order) {
      return new NextResponse("Order not found", { status: 404 })
    }

    const updatedOrder = await prisma.order.update({
      where: {
        id: params.orderId,
      },
      data: {
        status,
      },
    })

    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error("[ORDER_PATCH]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 