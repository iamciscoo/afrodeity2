"use client"

import { useState } from "react"
import { useCart } from "@/store/use-cart"
import { ShippingForm } from "@/components/checkout/shipping-form"
import { StripePaymentForm } from "@/components/checkout/payment-form"
import { OrderSummary } from "@/components/checkout/order-summary"

type CheckoutStep = "shipping" | "payment"

export default function CheckoutPage() {
  const [step, setStep] = useState<CheckoutStep>("shipping")
  const [shippingData, setShippingData] = useState<any>(null)
  const { items, total } = useCart()

  // Handle shipping form submission
  const handleShippingSubmit = (data: any) => {
    setShippingData(data)
    setStep("payment")
  }

  // Handle back button click in payment step
  const handleBackToShipping = () => {
    setStep("shipping")
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="py-16">
        <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>

        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          {/* Form Section */}
          <div className="lg:col-span-7">
            {step === "shipping" ? (
              <ShippingForm onSubmit={handleShippingSubmit} />
            ) : (
              <StripePaymentForm
                shippingData={shippingData}
                onBack={handleBackToShipping}
              />
            )}
          </div>

          {/* Order Summary Section */}
          <div className="mt-10 lg:col-span-5 lg:mt-0">
            <OrderSummary items={items} total={total} step={step} />
          </div>
        </div>
      </div>
    </div>
  )
} 