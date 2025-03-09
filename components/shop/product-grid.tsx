"use client"

import Image from "next/image"
import Link from "next/link"
import { Product, Category } from "@prisma/client"
import { Button } from "@/components/ui/button"

interface ProductWithCategory extends Product {
  category: Category
}

interface ProductGridProps {
  products: ProductWithCategory[]
  currentPage: number
  totalPages: number
}

export function ProductGrid({ products, currentPage, totalPages }: ProductGridProps) {
  return (
    <div className="space-y-6">
      {/* Products Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div key={product.id} className="group relative overflow-hidden rounded-lg border">
            <Link href={`/product/${product.id}`} className="relative block aspect-square">
              {product.images[0] && (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              )}
            </Link>
            <div className="p-4">
              <h3 className="font-semibold">
                <Link href={`/product/${product.id}`}>{product.name}</Link>
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{product.category.name}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-lg font-bold">${Number(product.price).toFixed(2)}</span>
                <Button variant="secondary" size="sm">Add to Cart</Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            disabled={currentPage <= 1}
            onClick={() => {
              const searchParams = new URLSearchParams(window.location.search)
              searchParams.set('page', String(currentPage - 1))
              window.location.search = searchParams.toString()
            }}
          >
            Previous
          </Button>
          <span className="flex h-9 items-center justify-center px-4">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={currentPage >= totalPages}
            onClick={() => {
              const searchParams = new URLSearchParams(window.location.search)
              searchParams.set('page', String(currentPage + 1))
              window.location.search = searchParams.toString()
            }}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
} 