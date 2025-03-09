import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { Role } from "@prisma/client"

export async function PATCH(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await auth()

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { role } = body

    if (!role || !Object.values(Role).includes(role)) {
      return new NextResponse("Invalid role", { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: {
        id: params.userId,
      },
    })

    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: params.userId,
      },
      data: {
        role,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("[USER_PATCH]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await auth()

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: {
        id: params.userId,
      },
    })

    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    if (user.role === "ADMIN") {
      return new NextResponse("Cannot delete admin user", { status: 400 })
    }

    await prisma.user.delete({
      where: {
        id: params.userId,
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[USER_DELETE]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 