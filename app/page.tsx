"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ArrowRight, ShoppingBag, Truck, Shield, Clock } from "lucide-react"
import { PriceDisplay } from "@/components/price-display"
import { NewsletterForm } from "@/components/newsletter-form"

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

      {/* Features Section */}
      <section className="border-y bg-muted/30">
        <div className="container py-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-4">
              <Truck className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Free Shipping</h3>
                <p className="text-sm text-muted-foreground">
                  On orders over <PriceDisplay amount={150} />
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ShoppingBag className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Easy Returns</h3>
                <p className="text-sm text-muted-foreground">30-day return policy</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Secure Payment</h3>
                <p className="text-sm text-muted-foreground">100% secure checkout</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Clock className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">24/7 Support</h3>
                <p className="text-sm text-muted-foreground">Always here to help</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="container">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Shop by Category</h2>
              <p className="mt-1 text-muted-foreground">
                Find what you're looking for by category
              </p>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/categories" className="flex items-center gap-2">
                View All Categories <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Category Cards */}
            <Link href="/categories/clothing" className="group relative overflow-hidden rounded-lg">
              <div className="aspect-[4/5] bg-muted">
                {/* Image will go here */}
              </div>
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-background/80 to-background/0 p-6 transition-all group-hover:from-background/90">
                <div>
                  <h3 className="font-semibold text-xl text-foreground">Clothing</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Traditional & Modern Wear</p>
                </div>
              </div>
            </Link>
            <Link href="/categories/accessories" className="group relative overflow-hidden rounded-lg">
              <div className="aspect-[4/5] bg-muted">
                {/* Image will go here */}
              </div>
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-background/80 to-background/0 p-6 transition-all group-hover:from-background/90">
                <div>
                  <h3 className="font-semibold text-xl text-foreground">Accessories</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Jewelry & More</p>
                </div>
              </div>
            </Link>
            <Link href="/categories/footwear" className="group relative overflow-hidden rounded-lg">
              <div className="aspect-[4/5] bg-muted">
                {/* Image will go here */}
              </div>
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-background/80 to-background/0 p-6 transition-all group-hover:from-background/90">
                <div>
                  <h3 className="font-semibold text-xl text-foreground">Footwear</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Shoes & Sandals</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="bg-muted/50 py-20">
        <div className="container">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Featured Products</h2>
              <p className="mt-1 text-muted-foreground">
                Our most popular items, handpicked for you
              </p>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/shop" className="flex items-center gap-2">
                View All Products <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Product Cards */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="group relative">
                <div className="aspect-[3/4] overflow-hidden rounded-lg bg-muted">
                  {/* Product Image will go here */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-background/0 group-hover:from-background/40" />
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">Product Name {i}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Product Description</p>
                  <div className="mt-2 flex items-center justify-between">
                    <PriceDisplay amount={99.99} className="text-lg font-bold" />
                    <Button variant="ghost" size="sm">
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="border-t py-20">
        <div className="container">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-3xl font-bold">Stay Updated</h2>
            <p className="mt-4 text-muted-foreground">
              Subscribe to our newsletter to receive updates, news, and exclusive offers
            </p>
            <div className="mt-6">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>
    </>
  )
} 