"use client"

import { formatPrice } from "@/lib/utils"
import { useCurrency } from "@/store/use-currency"

interface PriceDisplayProps {
  amount: number
  className?: string
}

export function PriceDisplay({ amount, className }: PriceDisplayProps) {
  const { currency } = useCurrency()
  return (
    <span className={className}>
      {formatPrice(amount, currency)}
    </span>
  )
} 