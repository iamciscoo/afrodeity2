import { prisma } from "@/lib/db"
import { ProductGrid } from "@/components/shop/product-grid"
import { ProductFilters } from "@/components/shop/product-filters"

interface ShopPageProps {
  searchParams: {
    category?: string
    sort?: string
    price_range?: string
    page?: string
  }
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  // Get all categories for the filter
  const categories = await prisma.category.findMany({
    orderBy: {
      name: 'asc'
    }
  })

  // Build the query based on filters
  const where = {
    ...(searchParams.category && {
      categoryId: searchParams.category
    })
  }

  // Handle price range filter
  if (searchParams.price_range) {
    const [min, max] = searchParams.price_range.split('-').map(Number)
    Object.assign(where, {
      price: {
        gte: min,
        lte: max
      }
    })
  }

  // Handle sorting
  const orderBy = searchParams.sort === 'price_desc' 
    ? { price: 'desc' as const }
    : searchParams.sort === 'price_asc'
    ? { price: 'asc' as const }
    : { createdAt: 'desc' as const }

  // Handle pagination
  const page = Number(searchParams.page) || 1
  const limit = 12
  const skip = (page - 1) * limit

  // Get products with filters
  const products = await prisma.product.findMany({
    where,
    orderBy,
    skip,
    take: limit,
    include: {
      category: true
    }
  })

  // Get total count for pagination
  const totalProducts = await prisma.product.count({ where })
  const totalPages = Math.ceil(totalProducts / limit)

  return (
    <div className="container px-4 py-8 md:px-6 lg:py-12">
      <div className="flex flex-col gap-8 md:flex-row">
        {/* Filters Sidebar */}
        <aside className="w-full md:w-64">
          <ProductFilters 
            categories={categories}
            searchParams={searchParams}
          />
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <ProductGrid 
            products={products}
            currentPage={page}
            totalPages={totalPages}
          />
        </div>
      </div>
    </div>
  )
} 