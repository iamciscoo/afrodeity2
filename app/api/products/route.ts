import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
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

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const validatedData = productSchema.parse(body)

    const product = await db.product.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        price: validatedData.price,
        stock: validatedData.stock,
        sku: validatedData.sku,
        categoryId: validatedData.categoryId,
        images: validatedData.images,
        tags: validatedData.tags
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 400 })
    }

    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "12")
    const search = searchParams.get("search") || ""
    const category = searchParams.get("category") || undefined
    const sort = searchParams.get("sort") || "createdAt.desc"
    const [sortField, sortOrder] = sort.split(".")
    const minPrice = parseFloat(searchParams.get("min_price") || "0")
    const maxPrice = parseFloat(searchParams.get("max_price") || "999999")
    const tags = searchParams.get("tags")?.split(",").filter(Boolean) || []

    const skip = (page - 1) * limit

    const where = {
      AND: [
        {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } }
          ]
        },
        { categoryId: category },
        { price: { gte: minPrice, lte: maxPrice } },
        tags.length > 0 ? { tags: { hasEvery: tags } } : {}
      ].filter(Boolean)
    }

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        include: {
          category: true
        },
        orderBy: {
          [sortField]: sortOrder.toLowerCase()
        },
        skip,
        take: limit
      }),
      db.product.count({ where })
    ])

    return NextResponse.json({
      items: products,
      total,
      totalPages: Math.ceil(total / limit)
    })
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 