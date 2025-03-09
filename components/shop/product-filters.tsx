"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface ProductFiltersProps {
  categories: {
    id: string
    name: string
  }[]
  searchParams: {
    search?: string
    category?: string
    sort?: string
    min_price?: string
    max_price?: string
    tags?: string
  }
  minPrice: number
  maxPrice: number
  tags: string[]
}

export function ProductFilters({
  categories,
  searchParams,
  minPrice,
  maxPrice,
  tags
}: ProductFiltersProps) {
  const router = useRouter()
  const params = useSearchParams()

  function createQueryString(
    name: string,
    value: string | null
  ) {
    const newParams = new URLSearchParams(params.toString())
    
    if (value === null) {
      newParams.delete(name)
    } else {
      newParams.set(name, value)
    }

    // Reset to page 1 when filters change
    if (name !== "page") {
      newParams.delete("page")
    }

    return newParams.toString()
  }

  const selectedTags = searchParams.tags?.split(",").filter(Boolean) || []

  const handleTagClick = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag]
    
    router.push(
      `?${createQueryString("tags", newTags.length > 0 ? newTags.join(",") : null)}`
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <Label>Search</Label>
        <Input
          placeholder="Search products..."
          value={searchParams.search || ""}
          onChange={(e) => {
            router.push(`?${createQueryString("search", e.target.value || null)}`)
          }}
        />
      </div>

      <div>
        <Label>Category</Label>
        <Select
          value={searchParams.category || ""}
          onValueChange={(value: string) => {
            router.push(`?${createQueryString("category", value || null)}`)
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Sort by</Label>
        <Select
          value={searchParams.sort || "createdAt.desc"}
          onValueChange={(value: string) => {
            router.push(`?${createQueryString("sort", value)}`)
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt.desc">Newest</SelectItem>
            <SelectItem value="createdAt.asc">Oldest</SelectItem>
            <SelectItem value="price.asc">Price: Low to High</SelectItem>
            <SelectItem value="price.desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Price Range</Label>
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="number"
            placeholder="Min"
            min={minPrice}
            max={maxPrice}
            value={searchParams.min_price || ""}
            onChange={(e) => {
              router.push(
                `?${createQueryString("min_price", e.target.value || null)}`
              )
            }}
          />
          <Input
            type="number"
            placeholder="Max"
            min={minPrice}
            max={maxPrice}
            value={searchParams.max_price || ""}
            onChange={(e) => {
              router.push(
                `?${createQueryString("max_price", e.target.value || null)}`
              )
            }}
          />
        </div>
      </div>

      <div>
        <Label>Tags</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "secondary"}
              className="cursor-pointer"
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        onClick={() => {
          router.push("/shop")
        }}
      >
        Clear Filters
        <X className="ml-2 h-4 w-4" />
      </Button>
    </div>
  )
} 