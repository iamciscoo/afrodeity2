import { create } from "zustand"
import { persist } from "zustand/middleware"
import { Product, Category } from "@prisma/client"

export interface CartItem {
  id: string
  productId: string
  quantity: number
  product: Product & {
    category: Category
  }
}

interface CartStore {
  items: CartItem[]
  total: number
  addItem: (product: Product & { category: Category }) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      addItem: (product: Product & { category: Category }) => {
        const currentItems = get().items
        const existingItem = currentItems.find(
          (item) => item.productId === product.id
        )

        if (existingItem) {
          const updatedItems = currentItems.map((item) =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
          set({
            items: updatedItems,
            total: calculateTotal(updatedItems),
          })
        } else {
          const updatedItems = [...currentItems, { id: product.id, productId: product.id, quantity: 1, product }]
          set({
            items: updatedItems,
            total: calculateTotal(updatedItems),
          })
        }
      },
      removeItem: (productId: string) => {
        const updatedItems = get().items.filter(
          (item) => item.productId !== productId
        )
        set({
          items: updatedItems,
          total: calculateTotal(updatedItems),
        })
      },
      updateQuantity: (productId: string, quantity: number) => {
        const updatedItems = get().items.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        )
        set({
          items: updatedItems,
          total: calculateTotal(updatedItems),
        })
      },
      clearCart: () => set({ items: [], total: 0 }),
    }),
    {
      name: "cart-storage",
    }
  )
)

// Helper function to calculate total
function calculateTotal(items: CartItem[]): number {
  return items.reduce((total, item) => {
    return total + Number(item.product.price) * item.quantity
  }, 0)
} 