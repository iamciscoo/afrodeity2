"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { getStripe } from "@/lib/stripe"

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),
  state: z.string().min(2, {
    message: "State must be at least 2 characters.",
  }),
  postalCode: z.string().min(5, {
    message: "Postal code must be at least 5 characters.",
  }),
  country: z.string().min(2, {
    message: "Country must be at least 2 characters.",
  }),
})

type FormData = z.infer<typeof formSchema>

interface PaymentFormProps {
  clientSecret: string
  shippingData: FormData
}

function PaymentForm({ clientSecret, shippingData }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const [isPending, setPending] = React.useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setPending(true)

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
          payment_method_data: {
            billing_details: {
              name: shippingData.fullName,
              email: shippingData.email,
              phone: shippingData.phone,
              address: {
                line1: shippingData.address,
                city: shippingData.city,
                state: shippingData.state,
                postal_code: shippingData.postalCode,
                country: shippingData.country,
              },
            },
          },
        },
      })

      if (error) {
        throw new Error(error.message)
      }
    } catch (error) {
      toast.error("Payment failed. Please try again.")
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button type="submit" className="w-full" disabled={!stripe || isPending}>
        {isPending ? "Processing..." : "Pay Now"}
      </Button>
    </form>
  )
}

export function PaymentFormWrapper({ clientSecret, shippingData }: PaymentFormProps) {
  return (
    <Elements stripe={getStripe()} options={{ clientSecret }}>
      <PaymentForm clientSecret={clientSecret} shippingData={shippingData} />
    </Elements>
  )
} 