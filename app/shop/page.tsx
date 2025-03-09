import { db } from "@/lib/db"
import { ProductGrid } from "@/components/shop/product-grid"
import { ProductFilters } from "@/components/shop/product-filters"

interface ShopPageProps {
  searchParams: {
    page?: string
    search?: string
    category?: string
    sort?: string
    min_price?: string
    max_price?: string
    tags?: string
  }
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const page = parseInt(searchParams.page || "1")
  const limit = 12
  const search = searchParams.search || ""
  const category = searchParams.category || undefined
  const sort = searchParams.sort || "createdAt.desc"
  const [sortField, sortOrder] = sort.split(".")
  const minPrice = parseFloat(searchParams.min_price || "0")
  const maxPrice = parseFloat(searchParams.max_price || "999999")
  const tags = searchParams.tags?.split(",").filter(Boolean) || []

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

  const [products, categories, total] = await Promise.all([
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
    db.category.findMany(),
    db.product.count({ where })
  ])

  // Get all unique tags from products
  const allTags = await db.product.findMany({
    select: {
      tags: true
    }
  })
  const uniqueTags = Array.from(new Set(allTags.flatMap(p => p.tags)))

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="lg:grid lg:grid-cols-5 lg:gap-x-8">
        <div className="hidden lg:block">
          <ProductFilters
            categories={categories}
            searchParams={searchParams}
            minPrice={0}
            maxPrice={999999}
            tags={uniqueTags}
          />
        </div>
        <div className="lg:col-span-4">
          <ProductGrid
            products={products}
            currentPage={page}
            totalPages={Math.ceil(total / limit)}
          />
        </div>
      </div>
    </div>
  )
} 