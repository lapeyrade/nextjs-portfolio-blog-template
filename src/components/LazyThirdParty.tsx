"use client"

import { useEffect, useState, type ComponentType, type ReactElement } from 'react'

type Mods = {
  Analytics?: ComponentType<unknown>
  SpeedInsights?: ComponentType<unknown>
}

export default function LazyThirdParty(): ReactElement | null {
  const [mods, setMods] = useState<Mods | null>(null)

  useEffect(() => {
    let mounted = true

    async function init() {
      try {
        // Dynamically import analytics and speed insights only on client after hydration
        const [{ Analytics }, { SpeedInsights }] = await Promise.all([
          import('@vercel/analytics/react'),
          import('@vercel/speed-insights/next'),
        ])

        if (!mounted) return

  // cast imported components into a generic ComponentType to avoid prop-type incompatibilities
  setMods({ Analytics: Analytics as unknown as ComponentType<unknown>, SpeedInsights: SpeedInsights as unknown as ComponentType<unknown> })
      } catch (err) {
        if (process.env.NODE_ENV === 'development') console.error('LazyThirdParty failed to load', err)
      }
    }

    // Defer loading to after first paint for LCP safety
    if ('requestIdleCallback' in window) {
      const w = window as unknown as { requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => number }
      w.requestIdleCallback?.(init, { timeout: 2000 })
    } else {
      const id = setTimeout(init, 300)
      return () => {
        mounted = false
        clearTimeout(id)
      }
    }

    return () => {
      mounted = false
    }
  }, [])

  if (!mods) return null

  const AnalyticsComp = mods.Analytics
  const SpeedComp = mods.SpeedInsights

  return (
    <>
      {AnalyticsComp ? <AnalyticsComp /> : null}
      {SpeedComp ? <SpeedComp /> : null}
    </>
  )
}
