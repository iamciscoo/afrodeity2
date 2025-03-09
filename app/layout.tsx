import { Inter, Roboto_Mono } from "next/font/google"
import { Suspense } from "react"
import { Toaster } from "sonner"
import { auth } from "@/auth"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ErrorBoundary } from "@/components/error-boundary"
import { Loading } from "@/components/loading"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata = {
  title: "Afrodeity - African Fashion E-commerce",
  description: "Discover and shop authentic African fashion and accessories.",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${robotoMono.variable} font-sans antialiased`}
      >
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
        <Toaster />
      </body>
    </html>
  )
} 