import { Decimal } from "@prisma/client/runtime/library"

export const formatDate = (date: Date | string): string => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export const formatPrice = (price: number | string | { toNumber: () => number }): string => {
  const numericPrice = typeof price === "string" 
    ? parseFloat(price) 
    : typeof price === "object" && "toNumber" in price
    ? price.toNumber()
    : price as number
    
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(numericPrice)
} 