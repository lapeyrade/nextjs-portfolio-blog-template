'use client'

import { useEffect, useState } from 'react'

type ThemeKey = 'ocean' | 'sunset' | 'forest' | 'purple' | 'rose' | 'aurora' | 'mono'
const THEMES: ThemeKey[] = ['ocean', 'sunset', 'forest', 'purple', 'rose', 'aurora', 'mono']
const THEME_PREVIEW: Record<ThemeKey, { from: string; to: string; label: string }> = {
    ocean: { from: '#22d3ee', to: '#3b82f6', label: 'Ocean' },
    sunset: { from: '#fb923c', to: '#ef4444', label: 'Sunset' },
    forest: { from: '#34d399', to: '#22c55e', label: 'Forest' },
    purple: { from: '#a78bfa', to: '#f472b6', label: 'Purple' },
    rose: { from: '#fb7185', to: '#f43f5e', label: 'Rose' },
    aurora: { from: '#22d3ee', to: '#a78bfa', label: 'Aurora' },
    mono: { from: '#9ca3af', to: '#e5e7eb', label: 'Mono' },
}

export default function ThemeSwitcher() {
    const [theme, setTheme] = useState<ThemeKey>('ocean')
    const [open, setOpen] = useState<boolean>(false)

    useEffect(() => {
        const stored = (typeof window !== 'undefined' && localStorage.getItem('theme')) as ThemeKey | null
        if (stored && THEMES.includes(stored)) {
            setTheme(stored)
            document.documentElement.setAttribute('data-theme', stored)
        }
    }, [])

    const onChange = (value: ThemeKey) => {
        setTheme(value)
        document.documentElement.setAttribute('data-theme', value)
        try { localStorage.setItem('theme', value) } catch { }
    }

    return (
        <div className="relative">
            <button
                type="button"
                aria-haspopup="true"
                aria-expanded={open}
                onClick={() => setOpen(v => !v)}
                className="inline-flex items-center gap-2 rounded-md border border-gray-700 bg-gray-900/60 px-3 py-1 text-sm text-gray-200 hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-strong)]"
            >
                Theme <span aria-hidden>▾</span>
            </button>
            {open && (
                <div className="absolute right-0 mt-2 flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-900/80 p-2 shadow-xl backdrop-blur-md z-50">
                    {THEMES.map((t) => {
                        const active = theme === t
                        const colors = THEME_PREVIEW[t]
                        return (
                            <button
                                key={t}
                                type="button"
                                onClick={() => { onChange(t); setOpen(false) }}
                                aria-pressed={active}
                                aria-label={`Switch to ${colors.label} theme`}
                                className={`relative h-8 w-8 rounded-full border transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-strong)] ${active ? 'scale-110 border-white' : 'border-gray-600 hover:scale-105'
                                    }`}
                                style={{ backgroundImage: `linear-gradient(135deg, ${colors.from}, ${colors.to})` }}
                            >
                                {active && (
                                    <span className="absolute -top-1 -right-1 inline-flex h-3 w-3 items-center justify-center rounded-full bg-white text-[10px] text-gray-900">✓</span>
                                )}
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    )
}


