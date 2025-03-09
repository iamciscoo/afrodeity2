"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CheckoutError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Something went wrong!
        </h1>
        <p className="mt-4 text-muted-foreground">
          We apologize for the inconvenience. Please try again or contact support
          if the problem persists.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Button onClick={reset} variant="outline">
            Try again
          </Button>
          <Button asChild>
            <Link href="/cart">Return to cart</Link>
          </Button>
        </div>
      </div>
    </div>
  )
} 