import { Inter, Roboto_Mono } from "next/font/google"
import { Suspense } from "react"
import { auth } from "@/auth"
import { ErrorBoundary } from "@/components/error-boundary"
import { Loading } from "@/components/loading"
import { Toaster } from "sonner"
import dynamic from "next/dynamic"
import Script from "next/script"
import { GA_TRACKING_ID } from "@/hooks/use-analytics"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

// Dynamically import components that are not needed immediately
const Header = dynamic(() => import("@/components/layout/header").then(mod => mod.Header), {
  loading: () => <div className="h-16 border-b" /> // Placeholder while loading
})

const Footer = dynamic(() => import("@/components/layout/footer").then(mod => mod.Footer), {
  loading: () => <div className="h-16 border-t" /> // Placeholder while loading
})

export const metadata = {
  title: "Afrodeity - African Fashion E-commerce",
  description: "Discover and shop authentic African fashion and accessories.",
  metadataBase: new URL(process.env.AUTH_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Afrodeity - African Fashion E-commerce",
    description: "Discover and shop authentic African fashion and accessories.",
    siteName: "Afrodeity",
  },
  twitter: {
    card: "summary_large_image",
    title: "Afrodeity - African Fashion E-commerce",
    description: "Discover and shop authentic African fashion and accessories.",
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <html lang="en">
      <head>
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_TRACKING_ID}');
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${robotoMono.variable} font-sans antialiased`}
      >
        <div className="relative flex min-h-screen flex-col">
          <Suspense fallback={<div className="h-16 border-b" />}>
            <Header user={session?.user} />
          </Suspense>
          <main className="flex-1">
            <ErrorBoundary fallback={<div>Something went wrong. Please try again later.</div>}>
              <Suspense fallback={<Loading />}>
                {children}
              </Suspense>
            </ErrorBoundary>
          </main>
          <Suspense fallback={<div className="h-16 border-t" />}>
            <Footer />
          </Suspense>
        </div>
        <Toaster />
      </body>
    </html>
  )
} 