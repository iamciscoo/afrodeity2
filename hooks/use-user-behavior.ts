"use client"

import { useEffect } from 'react'
import { useAnalytics } from './use-analytics'

export function useUserBehavior() {
  const analytics = useAnalytics()

  useEffect(() => {
    // Track user session duration
    const startTime = Date.now()
    
    const trackSessionDuration = () => {
      const duration = Math.floor((Date.now() - startTime) / 1000) // Duration in seconds
      analytics.event({
        action: 'session_duration',
        category: 'User Behavior',
        label: 'Session',
        value: duration,
      })
    }

    // Track scroll depth
    const trackScrollDepth = () => {
      const scrollDepth = Math.floor(
        (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100
      )
      analytics.event({
        action: 'scroll_depth',
        category: 'User Behavior',
        label: 'Scroll',
        value: scrollDepth,
      })
    }

    // Track clicks
    const trackClicks = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'BUTTON' || target.tagName === 'A') {
        analytics.event({
          action: 'click',
          category: 'User Behavior',
          label: target.textContent || target.tagName,
        })
      }
    }

    // Add event listeners
    window.addEventListener('scroll', trackScrollDepth)
    document.addEventListener('click', trackClicks)

    // Cleanup
    return () => {
      trackSessionDuration()
      window.removeEventListener('scroll', trackScrollDepth)
      document.removeEventListener('click', trackClicks)
    }
  }, [])

  return null
} 