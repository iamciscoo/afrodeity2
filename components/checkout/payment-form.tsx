"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/store/use-cart"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { ShippingData } from "./shipping-form"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { getStripe } from "@/lib/stripe"

interface PaymentFormProps {
  shippingData: ShippingData
  onBack: () => void
}

function PaymentForm({ shippingData, onBack }: PaymentFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { items, total, clearCart } = useCart()
  const stripe = useStripe()
  const elements = useElements()

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    
    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)

    try {
      // Create payment intent and order
      const response = await fetch("/api/stripe", {
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
          shippingAddress: shippingData,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create order")
      }

      const { clientSecret, orderId } = await response.json()

      // Confirm payment with Stripe
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success?orderId=${orderId}`,
        },
      })

      if (error) {
        throw error
      }

      // Payment successful - clear cart and redirect will happen automatically
      clearCart()
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
        <PaymentElement />

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
            disabled={isLoading || !stripe || !elements}
          >
            {isLoading ? "Processing..." : `Pay $${total.toFixed(2)}`}
          </Button>
        </div>
      </form>
    </div>
  )
}

// Wrapper component to provide Stripe context
export function StripePaymentForm(props: PaymentFormProps) {
  const [clientSecret, setClientSecret] = useState<string>()
  const { items } = useCart()

  // Initialize payment intent when component mounts
  useEffect(() => {
    fetch("/api/stripe", {
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
        shippingAddress: props.shippingData,
      }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret))
      .catch((error) => {
        console.error("Failed to initialize payment:", error)
        toast.error("Failed to initialize payment. Please try again.")
      })
  }, [items, props.shippingData])

  if (!clientSecret) {
    return <div>Loading payment form...</div>
  }

  return (
    <Elements
      stripe={getStripe()}
      options={{
        clientSecret,
        appearance: {
          theme: "stripe",
        },
      }}
    >
      <PaymentForm {...props} />
    </Elements>
  )
} 