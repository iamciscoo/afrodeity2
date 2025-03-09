"use client"

import { useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/store/use-cart"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Trash2 } from "lucide-react"

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCart()

  // Hydrate cart on mount
  useEffect(() => {
    useCart.persist.rehydrate()
  }, [])

  if (items.length === 0) {
    return (
      <div className="container flex flex-col items-center justify-center space-y-4 py-12">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="text-muted-foreground">Add some items to your cart to get started.</p>
        <Button asChild>
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Cart Items */}
        <div className="lg:col-span-8">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 rounded-lg border p-4"
              >
                {/* Product Image */}
                <div className="relative aspect-square h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                  {item.product.images[0] && (
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>

                {/* Product Info */}
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold">
                        <Link href={`/product/${item.product.id}`}>
                          {item.product.name}
                        </Link>
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {item.product.category.name}
                      </p>
                    </div>
                    <p className="font-semibold">
                      ${Number(item.product.price).toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity and Remove */}
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min={1}
                        max={item.product.stock}
                        value={item.quantity}
                        onChange={(e) => {
                          const value = parseInt(e.target.value)
                          if (value > 0 && value <= item.product.stock) {
                            updateQuantity(item.productId, value)
                          }
                        }}
                        className="w-20"
                      />
                      <span className="text-sm text-muted-foreground">
                        of {item.product.stock} available
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        removeItem(item.productId)
                        toast.success("Item removed from cart")
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove item</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4">
          <div className="rounded-lg border p-6">
            <h2 className="text-lg font-semibold">Order Summary</h2>
            <div className="mt-4 space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <Button className="w-full" size="lg" asChild>
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 