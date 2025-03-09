"use client"

import { useState, useEffect } from "react"

interface CacheItem<T> {
  data: T
  timestamp: number
}

const cache = new Map<string, CacheItem<any>>()
const DEFAULT_TTL = 5 * 60 * 1000 // 5 minutes in milliseconds

export function useCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = DEFAULT_TTL
) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check cache first
        const cachedItem = cache.get(key)
        if (cachedItem && Date.now() - cachedItem.timestamp < ttl) {
          setData(cachedItem.data)
          setLoading(false)
          return
        }

        // Fetch fresh data
        const freshData = await fetcher()
        
        // Update cache
        cache.set(key, {
          data: freshData,
          timestamp: Date.now(),
        })

        setData(freshData)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [key, ttl])

  // Function to manually invalidate the cache
  const invalidateCache = () => {
    cache.delete(key)
  }

  // Function to manually refresh the data
  const refresh = async () => {
    setLoading(true)
    try {
      const freshData = await fetcher()
      cache.set(key, {
        data: freshData,
        timestamp: Date.now(),
      })
      setData(freshData)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'))
    } finally {
      setLoading(false)
    }
  }

  return {
    data,
    error,
    loading,
    invalidateCache,
    refresh
  }
} 