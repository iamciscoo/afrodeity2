"use client"

import * as React from "react"
import { Suspense } from "react"
import { ErrorBoundary } from "@/components/error-boundary"
import { Loading } from "@/components/loading"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <ErrorBoundary
          fallback={
            <div className="flex h-screen items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-semibold">Authentication Error</h2>
                <p className="mt-2 text-muted-foreground">
                  There was a problem with authentication. Please try again later.
                </p>
              </div>
            </div>
          }
        >
          <Suspense fallback={<Loading />}>
            {children}
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  )
} 