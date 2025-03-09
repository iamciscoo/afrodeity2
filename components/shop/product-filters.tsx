"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Category } from "@prisma/client"
import { Button } from "@/components/ui/button"

interface ProductFiltersProps {
  categories: Category[]
  searchParams: {
    category?: string
    sort?: string
    price_range?: string
  }
}

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
]

const priceRanges = [
  { label: "All", value: "" },
  { label: "Under $50", value: "0-50" },
  { label: "$50 - $100", value: "50-100" },
  { label: "$100 - $200", value: "100-200" },
  { label: "Over $200", value: "200-1000" },
]

export function ProductFilters({ categories, searchParams }: ProductFiltersProps) {
  const router = useRouter()
  const currentParams = useSearchParams()

  function setFilter(name: string, value: string) {
    const params = new URLSearchParams(currentParams.toString())
    
    if (value) {
      params.set(name, value)
    } else {
      params.delete(name)
    }
    
    // Reset to first page when filters change
    params.delete('page')
    
    router.push(`/shop?${params.toString()}`)
  }

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Categories</h3>
        <div className="space-y-2">
          <Button
            variant={!searchParams.category ? "default" : "outline"}
            className="w-full justify-start"
            onClick={() => setFilter("category", "")}
          >
            All Categories
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={searchParams.category === category.id ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => setFilter("category", category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Sort By</h3>
        <div className="space-y-2">
          {sortOptions.map((option) => (
            <Button
              key={option.value}
              variant={searchParams.sort === option.value ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => setFilter("sort", option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Price Range</h3>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <Button
              key={range.value}
              variant={searchParams.price_range === range.value ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => setFilter("price_range", range.value)}
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
} 