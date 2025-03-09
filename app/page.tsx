import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background py-20">
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Discover Authentic African Fashion
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Explore our curated collection of African-inspired clothing and accessories.
              Each piece tells a story of rich cultural heritage and contemporary style.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg">
                <Link href="/shop">Shop Now</Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link href="/categories">Browse Categories</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold tracking-tight">
            Featured Products
          </h2>
          <p className="mt-4 text-center text-lg text-muted-foreground">
            Our most popular items, handpicked for you
          </p>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Product cards will go here */}
            <div className="flex h-64 items-center justify-center rounded-lg border bg-card p-6 text-center">
              Product Card 1
            </div>
            <div className="flex h-64 items-center justify-center rounded-lg border bg-card p-6 text-center">
              Product Card 2
            </div>
            <div className="flex h-64 items-center justify-center rounded-lg border bg-card p-6 text-center">
              Product Card 3
            </div>
          </div>
          <div className="mt-12 text-center">
            <Button variant="outline" asChild>
              <Link href="/shop">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
} 