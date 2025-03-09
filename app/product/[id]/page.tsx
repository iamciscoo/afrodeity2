import { notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import { ProductGallery } from "@/components/product/product-gallery"
import { ProductInfo } from "@/components/product/product-info"
import { RelatedProducts } from "@/components/product/related-products"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  // Fetch product with its category and reviews
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      category: true,
      reviews: {
        include: {
          user: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  })

  if (!product) {
    notFound()
  }

  // Calculate average rating
  const averageRating = product.reviews.length > 0
    ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
    : 0

  // Fetch related products from the same category
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      NOT: {
        id: product.id
      }
    },
    take: 4,
    include: {
      category: true
    }
  })

  return (
    <div className="container px-4 py-8 md:px-6 lg:py-12">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Product Gallery */}
        <ProductGallery images={product.images} name={product.name} />

        {/* Product Info */}
        <ProductInfo
          product={product}
          averageRating={averageRating}
          reviewCount={product.reviews.length}
        />
      </div>

      {/* Product Description */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold">Description</h2>
        <div className="mt-4 prose prose-sm max-w-none">
          <p>{product.description}</p>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold">Customer Reviews</h2>
        <div className="mt-6 space-y-8">
          {product.reviews.map((review) => (
            <div key={review.id} className="border-b pb-8">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <span className="inline-block h-8 w-8 rounded-full bg-gray-200" />
                </div>
                <div>
                  <p className="font-medium">{review.user.name}</p>
                  <div className="mt-1 flex items-center">
                    {/* Star rating */}
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? "text-yellow-400"
                              : "text-gray-200"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              {review.comment && (
                <p className="mt-4 text-muted-foreground">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts products={relatedProducts} />
    </div>
  )
} 