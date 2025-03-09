"use client"

import * as React from "react"
import { Product, Category } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

interface ProductInfoProps {
  product: Product & {
    category: Category
  }
  averageRating: number
  reviewCount: number
}

export function ProductInfo({
  product,
  averageRating,
  reviewCount,
}: ProductInfoProps) {
  const [quantity, setQuantity] = React.useState(1)

  function onQuantityChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = parseInt(e.target.value)
    if (value > 0 && value <= product.stock) {
      setQuantity(value)
    }
  }

  async function addToCart() {
    try {
      // TODO: Implement add to cart functionality
      toast.success(`Added ${quantity} ${quantity === 1 ? 'item' : 'items'} to cart`)
    } catch (error) {
      toast.error("Failed to add to cart. Please try again.")
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {product.category.name}
        </p>
      </div>

      {/* Price */}
      <div className="flex items-center gap-4">
        <span className="text-3xl font-bold">
          ${Number(product.price).toFixed(2)}
        </span>
        {product.stock > 0 ? (
          <span className="text-sm text-green-600">In Stock</span>
        ) : (
          <span className="text-sm text-red-600">Out of Stock</span>
        )}
      </div>

      {/* Rating */}
      <div className="flex items-center gap-4">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`h-5 w-5 ${
                i < Math.round(averageRating)
                  ? "text-yellow-400"
                  : "text-gray-200"
              }`}
            >
              ★
            </span>
          ))}
        </div>
        <span className="text-sm text-muted-foreground">
          {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
        </span>
      </div>

      {/* Add to Cart */}
      {product.stock > 0 && (
        <div className="mt-4 flex items-center gap-4">
          <div className="w-24">
            <Input
              type="number"
              min={1}
              max={product.stock}
              value={quantity}
              onChange={onQuantityChange}
            />
          </div>
          <Button onClick={addToCart} size="lg">
            Add to Cart
          </Button>
        </div>
      )}

      {/* Stock Info */}
      {product.stock > 0 && (
        <p className="text-sm text-muted-foreground">
          {product.stock} items left in stock
        </p>
      )}
    </div>
  )
} 