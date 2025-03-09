"use client"

import { useEffect } from 'react'
import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { GA_TRACKING_ID, pageview } from '@/hooks/use-analytics'
import { useUserBehavior } from '@/hooks/use-user-behavior'

export function AnalyticsProvider() {
  const pathname = usePathname()
  useUserBehavior()

  useEffect(() => {
    if (pathname) {
      pageview(pathname)
    }
  }, [pathname])

  if (!GA_TRACKING_ID) return null

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}');
          `,
        }}
      />
    </>
  )
} 