"use client"

import Image from "next/image"
import Link from "next/link"
import { CartItem } from "@/store/use-cart"

interface OrderSummaryProps {
  items: CartItem[]
  total: number
  step: "shipping" | "payment"
}

export function OrderSummary({ items, total, step }: OrderSummaryProps) {
  // Calculate shipping cost (free for orders over $150)
  const shippingCost = total >= 150 ? 0 : 10
  const finalTotal = total + shippingCost

  return (
    <div className="rounded-lg border bg-card">
      <div className="p-6">
        <h2 className="text-lg font-semibold">Order Summary</h2>
        <div className="mt-6 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4">
              {/* Product Image */}
              <div className="relative aspect-square h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
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
                <h3 className="text-sm font-medium">
                  <Link href={`/product/${item.product.id}`}>
                    {item.product.name}
                  </Link>
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Qty: {item.quantity}
                </p>
                <p className="mt-auto text-sm font-medium">
                  ${Number(item.product.price).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="mt-6 space-y-4">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            {shippingCost === 0 ? (
              <span className="text-green-600">Free</span>
            ) : (
              <span>${shippingCost.toFixed(2)}</span>
            )}
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>
            {total < 150 && (
              <p className="mt-2 text-sm text-muted-foreground">
                Add ${(150 - total).toFixed(2)} more to get free shipping
              </p>
            )}
          </div>
        </div>

        {/* Order Status */}
        <div className="mt-6 space-y-4 border-t pt-6">
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${
                step === "shipping" ? "bg-primary" : "bg-muted"
              }`}
            />
            <span
              className={
                step === "shipping"
                  ? "text-sm font-medium"
                  : "text-sm text-muted-foreground"
              }
            >
              Shipping Information
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${
                step === "payment" ? "bg-primary" : "bg-muted"
              }`}
            />
            <span
              className={
                step === "payment"
                  ? "text-sm font-medium"
                  : "text-sm text-muted-foreground"
              }
            >
              Payment Details
            </span>
          </div>
        </div>
      </div>
    </div>
  )
} 