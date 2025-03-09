"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/store/use-cart"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { ShippingData } from "./shipping-form"

interface PaymentFormProps {
  shippingData: ShippingData
  onBack: () => void
}

export function PaymentForm({ shippingData, onBack }: PaymentFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { items, total, clearCart } = useCart()

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Create order in the database
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
          total: total,
          shippingAddress: {
            fullName: shippingData.fullName,
            email: shippingData.email,
            phone: shippingData.phone,
            address: shippingData.address,
            city: shippingData.city,
            state: shippingData.state,
            postalCode: shippingData.postalCode,
            country: shippingData.country,
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create order")
      }

      const { orderId } = await response.json()

      // TODO: Implement Stripe payment
      // For now, just simulate a successful payment
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Clear cart and redirect to success page
      clearCart()
      router.push(`/checkout/success?orderId=${orderId}`)
    } catch (error) {
      console.error("Checkout error:", error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Payment Method</h2>
        <p className="text-sm text-muted-foreground">
          All transactions are secure and encrypted.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {/* TODO: Add Stripe Elements */}
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">
            Payment functionality will be implemented with Stripe.
          </p>
        </div>

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={isLoading}
          >
            Back
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : `Pay $${total.toFixed(2)}`}
          </Button>
        </div>
      </form>
    </div>
  )
} 