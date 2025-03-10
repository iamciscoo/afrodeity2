import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prismadb from "@/lib/prismadb"
import { z } from "zod"

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().min(0, "Price must be greater than 0"),
  stock: z.coerce.number().min(0, "Stock must be greater than or equal to 0"),
  sku: z.string().min(1, "SKU is required"),
  categoryId: z.string().min(1, "Category is required"),
  images: z.array(z.string()).min(1, "At least one image is required"),
  tags: z.array(z.string()).default([])
})

export async function PATCH(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const validatedData = productSchema.parse(body)

    const product = await prismadb.product.update({
      where: {
        id: params.productId
      },
      data: validatedData
    })

    return NextResponse.json(product)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 400 })
    }

    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const product = await prismadb.product.delete({
      where: {
        id: params.productId
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 