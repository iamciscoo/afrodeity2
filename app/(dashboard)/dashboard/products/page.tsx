import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { ProductsTable } from "@/components/dashboard/products/products-table"
import { ProductsTableToolbar } from "@/components/dashboard/products/products-table-toolbar"

export default async function ProductsPage() {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  })

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
      </div>
      <div className="space-y-4">
        <ProductsTableToolbar />
        <ProductsTable products={products} categories={categories} />
      </div>
    </div>
  )
} 