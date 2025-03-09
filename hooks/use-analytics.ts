"use client"

import { useEffect } from 'react'

declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}

type GTagEvent = {
  action: string
  category: string
  label: string
  value?: number
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

// Initialize GA
export const initGA = () => {
  if (typeof window === 'undefined') return

  window.dataLayer = window.dataLayer || []
  function gtag(...args: any[]) {
    window.dataLayer.push(args)
  }
  gtag('js', new Date())
  gtag('config', GA_TRACKING_ID)
}

// Track page views
export const pageview = (url: string) => {
  if (typeof window === 'undefined') return
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  })
}

// Track events
export const event = ({ action, category, label, value }: GTagEvent) => {
  if (typeof window === 'undefined') return
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}

// Custom hook for analytics
export function useAnalytics() {
  useEffect(() => {
    initGA()
  }, [])

  return {
    pageview,
    event,
    // E-commerce specific events
    trackAddToCart: (product: { id: string; name: string; price: number }) => {
      event({
        action: 'add_to_cart',
        category: 'E-commerce',
        label: product.name,
        value: Number(product.price),
      })
    },
    trackPurchase: (orderId: string, total: number) => {
      event({
        action: 'purchase',
        category: 'E-commerce',
        label: orderId,
        value: total,
      })
    },
    trackProductView: (product: { id: string; name: string }) => {
      event({
        action: 'view_item',
        category: 'E-commerce',
        label: product.name,
      })
    },
  }
} 