import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Currency = {
  code: string
  symbol: string
  rate: number
}

export const currencies: Currency[] = [
  { code: "USD", symbol: "$", rate: 1 },
  { code: "EUR", symbol: "€", rate: 0.92 },
  { code: "KES", symbol: "KSh", rate: 132.50 },
  { code: "TZS", symbol: "TSh", rate: 2565.00 },
]

interface CurrencyStore {
  currency: Currency
  setCurrency: (currency: Currency) => void
}

export const useCurrency = create<CurrencyStore>()(
  persist(
    (set) => ({
      currency: currencies[0],
      setCurrency: (currency) => set({ currency }),
    }),
    {
      name: "currency-store",
    }
  )
) 