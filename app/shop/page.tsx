import { Suspense } from "react"
import prismadb from "@/lib/prismadb"
import { ProductGrid } from "@/components/shop/product-grid"
import { ProductFilters } from "@/components/shop/product-filters"
import { Loading } from "@/components/loading"
import { Prisma, Product, Category } from "@prisma/client"

interface ShopPageProps {
  searchParams: {
    page?: string
    limit?: string
    search?: string
    category?: string
    sort?: string
    min_price?: string
    max_price?: string
    tags?: string
  }
}

type ProductWithCategory = Product & {
  category: Category
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const page = parseInt(searchParams.page || "1")
  const limit = parseInt(searchParams.limit || "12")
  const search = searchParams.search || ""
  const category = searchParams.category || undefined
  const sort = searchParams.sort || "createdAt.desc"
  const [sortField, sortOrder] = sort.split(".")
  const minPrice = parseFloat(searchParams.min_price || "0")
  const maxPrice = parseFloat(searchParams.max_price || "999999")
  const tags = searchParams.tags?.split(",").filter(Boolean) || []

  const skip = (page - 1) * limit

  const where: Prisma.ProductWhereInput = {
    ...(search ? {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } }
      ]
    } : {}),
    ...(category ? { categoryId: category } : {}),
    price: { gte: minPrice, lte: maxPrice },
    ...(tags.length > 0 ? { tags: { hasSome: tags } } : {})
  }

  const [products, categories, total] = await Promise.all([
    prismadb.product.findMany({
      where,
      include: {
        category: true
      },
      orderBy: {
        [sortField]: sortOrder.toLowerCase() as Prisma.SortOrder
      },
      skip,
      take: limit
    }),
    prismadb.category.findMany(),
    prismadb.product.count({ where })
  ])

  // Get all unique tags from products
  const allProducts = await prismadb.product.findMany()
  const uniqueTags = Array.from(
    new Set(allProducts.flatMap(product => product.tags))
  ).sort()

  return (
    <div className="flex flex-col space-y-8 p-8">
      <Suspense fallback={<Loading />}>
        <ProductFilters
          categories={categories}
          tags={uniqueTags}
          searchParams={searchParams}
          minPrice={minPrice}
          maxPrice={maxPrice}
        />
      </Suspense>
      <Suspense fallback={<Loading />}>
        <ProductGrid
          products={products.map((product: ProductWithCategory) => ({
            id: product.id,
            name: product.name,
            description: product.description,
            price: Number(product.price),
            images: product.images,
            tags: product.tags,
            category: {
              id: product.category.id,
              name: product.category.name,
            }
          }))}
          currentPage={page}
          totalPages={Math.ceil(total / limit)}
        />
      </Suspense>
    </div>
  )
} 