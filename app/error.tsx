"use client"

import * as React from "react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Something went wrong!
          </h1>
          <p className="text-sm text-muted-foreground">
            An error occurred. Please try again.
          </p>
        </div>
        <div className="flex justify-center space-x-4">
          <button
            onClick={reset}
            className="text-sm text-muted-foreground hover:text-brand underline underline-offset-4"
          >
            Try again
          </button>
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-brand underline underline-offset-4"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  )
} 