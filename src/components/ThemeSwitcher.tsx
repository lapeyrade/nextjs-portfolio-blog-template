'use client'

import { useEffect, useState } from 'react'

type ThemeKey = 'ocean' | 'sunset' | 'forest' | 'purple' | 'rose' | 'aurora'
const THEMES: ThemeKey[] = ['ocean', 'sunset', 'forest', 'purple', 'rose', 'aurora']
const THEME_PREVIEW: Record<ThemeKey, { from: string; to: string; label: string }> = {
  ocean: { from: '#22d3ee', to: '#3b82f6', label: 'Ocean' },
  sunset: { from: '#fb923c', to: '#ef4444', label: 'Sunset' },
  forest: { from: '#34d399', to: '#22c55e', label: 'Forest' },
  purple: { from: '#a78bfa', to: '#f472b6', label: 'Purple' },
  rose: { from: '#fb7185', to: '#f43f5e', label: 'Rose' },
  aurora: { from: '#22d3ee', to: '#a78bfa', label: 'Aurora' },
}

interface ThemeSwitcherProps {
  variant?: 'desktop' | 'mobile'
}

export default function ThemeSwitcher({ variant = 'desktop' }: ThemeSwitcherProps) {
  const [theme, setTheme] = useState<ThemeKey>('ocean')
  const [open, setOpen] = useState<boolean>(false)

  useEffect(() => {
    const stored = (typeof window !== 'undefined' &&
      localStorage.getItem('theme')) as ThemeKey | null
    if (stored && THEMES.includes(stored)) {
      setTheme(stored)
      document.documentElement.setAttribute('data-theme', stored)
    }
  }, [])

  const onChange = (value: ThemeKey) => {
    setTheme(value)
    document.documentElement.setAttribute('data-theme', value)
    try {
      localStorage.setItem('theme', value)
    } catch {}
  }

  const isMobile = variant === 'mobile'
  const buttonClasses = isMobile
    ? 'inline-flex items-center gap-1 rounded-md border border-gray-700 bg-gray-900/60 px-2 py-1 text-xs text-gray-200 hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]'
    : 'inline-flex items-center gap-2 rounded-md border border-gray-700 bg-gray-900/60 px-3 py-1 text-sm text-gray-200 hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]'

  const panelClasses = isMobile
    ? 'absolute right-0 mt-1 flex items-center gap-1 rounded-lg border border-gray-700 bg-gray-900/80 p-1 shadow-lg backdrop-blur-md z-50'
    : 'absolute right-0 mt-2 flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-900/80 p-2 shadow-xl backdrop-blur-md z-50'

  const swatchSize = isMobile ? 'h-6 w-6' : 'h-8 w-8'
  const checkmarkSize = isMobile ? 'h-2 w-2 text-[8px]' : 'h-3 w-3 text-[10px]'

  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={buttonClasses}
      >
        Theme <span aria-hidden>▾</span>
      </button>
      {open && (
        <div className={panelClasses}>
          {THEMES.map((t) => {
            const active = theme === t
            const colors = THEME_PREVIEW[t]
            return (
              <button
                key={t}
                type="button"
                onClick={() => {
                  onChange(t)
                  setOpen(false)
                }}
                aria-pressed={active}
                aria-label={`Switch to ${colors.label} theme`}
                className={`relative ${swatchSize} rounded-full border transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                  active ? 'scale-110 border-white' : 'border-gray-600 hover:scale-105'
                }`}
                style={{ backgroundImage: `linear-gradient(135deg, ${colors.from}, ${colors.to})` }}
              >
                {active && (
                  <span
                    className={`absolute -top-0.5 -right-0.5 inline-flex ${checkmarkSize} items-center justify-center rounded-full bg-white text-gray-900`}
                  >
                    ✓
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
