"use client"

import Image from "next/image"
import Link from "next/link"
import { Product, Category } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { useCart } from "@/store/use-cart"
import { toast } from "sonner"

interface RelatedProductsProps {
  products: (Product & {
    category: Category
  })[]
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  const addItem = useCart(state => state.addItem)

  if (products.length === 0) return null

  function addToCart(product: Product & { category: Category }) {
    try {
      addItem(product, 1)
      toast.success("Added 1 item to cart")
    } catch (error) {
      toast.error("Failed to add to cart. Please try again.")
    }
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold">Related Products</h2>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => addToCart(product)}
                  disabled={product.stock === 0}
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 