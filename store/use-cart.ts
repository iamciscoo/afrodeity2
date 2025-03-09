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
  addItem: (product: Product & { category: Category }, quantity: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity) => {
        const items = get().items
        const existingItem = items.find(item => item.productId === product.id)

        if (existingItem) {
          // Update quantity if item exists
          const newQuantity = existingItem.quantity + quantity
          if (newQuantity <= product.stock) {
            set({
              items: items.map(item =>
                item.productId === product.id
                  ? { ...item, quantity: newQuantity }
                  : item
              )
            })
          }
        } else {
          // Add new item
          if (quantity <= product.stock) {
            set({
              items: [
                ...items,
                {
                  id: `${product.id}-${Date.now()}`,
                  productId: product.id,
                  quantity,
                  product
                }
              ]
            })
          }
        }
      },
      removeItem: (productId) => {
        set({
          items: get().items.filter(item => item.productId !== productId)
        })
      },
      updateQuantity: (productId, quantity) => {
        const items = get().items
        const item = items.find(item => item.productId === productId)

        if (item && quantity > 0 && quantity <= item.product.stock) {
          set({
            items: items.map(item =>
              item.productId === productId
                ? { ...item, quantity }
                : item
            )
          })
        }
      },
      clearCart: () => {
        set({ items: [] })
      },
      getCartTotal: () => {
        return get().items.reduce((total, item) => {
          return total + (Number(item.product.price) * item.quantity)
        }, 0)
      }
    }),
    {
      name: "cart-storage",
      skipHydration: true,
    }
  )
) 