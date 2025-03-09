import { Inter, Roboto_Mono } from "next/font/google"
import { Suspense } from "react"
import { Toaster } from "sonner"
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${robotoMono.variable} font-sans antialiased`}
      >
        <ErrorBoundary fallback={<div>Something went wrong. Please try again later.</div>}>
          <Suspense fallback={<Loading />}>
            {children}
          </Suspense>
        </ErrorBoundary>
        <Toaster />
      </body>
    </html>
  )
} 