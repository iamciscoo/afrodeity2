import * as React from "react"
import { Suspense } from "react"
import { auth } from "@/auth"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ErrorBoundary } from "@/components/error-boundary"
import { Loading } from "@/components/loading"

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <div className="relative flex min-h-screen flex-col">
      <Header user={session?.user} />
      <main className="flex-1">
        <ErrorBoundary fallback={<div>Something went wrong. Please try again later.</div>}>
          <Suspense fallback={<Loading />}>
            {children}
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  )
} 