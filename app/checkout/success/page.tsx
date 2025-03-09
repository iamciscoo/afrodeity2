"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")

  useEffect(() => {
    // You could fetch order details here if needed
  }, [orderId])

  return (
    <div className="container flex min-h-[600px] flex-col items-center justify-center">
      <div className="mx-auto max-w-md text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="mt-6 text-3xl font-bold">Payment Successful!</h1>
        <p className="mt-4 text-muted-foreground">
          Thank you for your purchase. Your order has been confirmed and will be shipped soon.
        </p>
        {orderId && (
          <p className="mt-2 text-sm text-muted-foreground">
            Order ID: {orderId}
          </p>
        )}
        <div className="mt-8 flex justify-center space-x-4">
          <Button asChild>
            <Link href="/dashboard/orders">View Order</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  )
} 