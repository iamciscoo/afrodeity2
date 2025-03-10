"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/store/use-cart"
import { ShippingForm } from "@/components/checkout/shipping-form"
import { PaymentFormWrapper } from "@/components/checkout/payment-form"
import { OrderSummary } from "@/components/checkout/order-summary"

type CheckoutStep = "shipping" | "payment"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total } = useCart()
  const [step, setStep] = React.useState<CheckoutStep>("shipping")
  const [shippingData, setShippingData] = React.useState<any>(null)
  const [clientSecret, setClientSecret] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (items.length === 0) {
      router.push("/cart")
    }
  }, [items, router])

  const handleShippingSubmit = async (data: any) => {
    try {
      const response = await fetch("/api/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
          shippingAddress: data,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create payment intent")
      }

      const { clientSecret } = await response.json()
      setClientSecret(clientSecret)
      setShippingData(data)
      setStep("payment")
    } catch (error) {
      console.error("Error:", error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <div className="rounded-lg border p-6">
            {step === "shipping" ? (
              <>
                <h2 className="mb-4 text-2xl font-semibold">Shipping Information</h2>
                <ShippingForm onSubmit={handleShippingSubmit} />
              </>
            ) : (
              <>
                <h2 className="mb-4 text-2xl font-semibold">Payment Information</h2>
                {clientSecret && shippingData ? (
                  <PaymentFormWrapper
                    clientSecret={clientSecret}
                    shippingData={shippingData}
                  />
                ) : (
                  <div>Loading payment form...</div>
                )}
              </>
            )}
          </div>
        </div>
        <div>
          <OrderSummary items={items} total={total} />
        </div>
      </div>
    </div>
  )
} 