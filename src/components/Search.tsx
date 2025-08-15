'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

type Result = {
    url: string
    title: string
    description?: string
    type: 'page' | 'blog'
    date?: string
}

interface SearchProps {
    enableHotkey?: boolean
}

export default function Search({ enableHotkey = true }: SearchProps) {
    const [open, setOpen] = useState(false)
    const [q, setQ] = useState('')
    const [results, setResults] = useState<Result[]>([])
    const [activeIndex, setActiveIndex] = useState(0)
    const inputRef = useRef<HTMLInputElement>(null)

    // Toggle with cmd+k / ctrl+k
    useEffect(() => {
        if (!enableHotkey) return

        const onKey = (e: KeyboardEvent) => {
            const isMac = navigator.platform.toUpperCase().includes('MAC')
            const combo = (isMac && e.metaKey && e.key.toLowerCase() === 'k') || (!isMac && e.ctrlKey && e.key.toLowerCase() === 'k')
            if (combo) {
                e.preventDefault()
                setOpen((v) => !v)
            }
            if (e.key === 'Escape') setOpen(false)
            if (open && results.length > 0) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault()
                    setActiveIndex((i) => Math.min(i + 1, results.length - 1))
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault()
                    setActiveIndex((i) => Math.max(i - 1, 0))
                } else if (e.key === 'Enter') {
                    const target = results[activeIndex]
                    if (target) {
                        window.location.href = target.url
                    }
                }
            }
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [open, results, activeIndex, enableHotkey])

    useEffect(() => {
        if (!open) return
        inputRef.current?.focus()
        setActiveIndex(0)
    }, [open])

    useEffect(() => {
        const controller = new AbortController()
        const fetchResults = async () => {
            const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: controller.signal })
            if (!res.ok) return
            const data = await res.json()
            setResults(data)
            setActiveIndex(0)
        }
        fetchResults().catch(() => { })
        return () => controller.abort()
    }, [q])

    return (
        <div>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-2 rounded-md border border-accent px-3 py-1.5 text-sm text-accent hover:bg-gray-800"
                aria-label="Open search"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                    <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 4.27 12.03l3.74 3.73a.75.75 0 1 0 1.06-1.06l-3.73-3.74A6.75 6.75 0 0 0 10.5 3.75Zm-5.25 6.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Z" clipRule="evenodd" />
                </svg>
                <span>Search</span>
                {enableHotkey && <span className="ml-1 rounded bg-gray-700/60 px-1.5 py-0.5 text-[10px]">⌘K</span>}
            </button>

            {open && (
                <div className="fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
                    <div className="relative mx-auto mt-20 w-[92%] max-w-xl theme-panel p-4 shadow-xl">
                        <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-foreground/70">
                                <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 4.27 12.03l3.74 3.73a.75.75 0 1 0 1.06-1.06l-3.73-3.74A6.75 6.75 0 0 0 10.5 3.75Zm-5.25 6.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Z" clipRule="evenodd" />
                            </svg>
                            <input
                                ref={inputRef}
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder="Search docs, articles, pages..."
                                className="w-full bg-transparent text-foreground placeholder:text-foreground/70 focus:outline-none"
                                aria-label="Search site"
                            />
                            <button onClick={() => setOpen(false)} className="text-foreground/70 hover:text-accent" aria-label="Close search">Esc</button>
                        </div>
                        <div className="mt-3 max-h-80 overflow-y-auto divide-y divide-[var(--panel-border)]">
                            {results.length === 0 ? (
                                <div className="p-3 text-foreground/70">No results</div>
                            ) : (
                                results.map((r, idx) => (
                                    <Link
                                        key={r.url}
                                        href={r.url}
                                        className={`block p-3 rounded ${idx === activeIndex ? 'bg-gray-800/60' : 'hover:bg-gray-800/50'}`}
                                        onMouseEnter={() => setActiveIndex(idx)}
                                        onClick={() => setOpen(false)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-medium text-foreground">{r.title}</h4>
                                            <span className="text-xs text-foreground/60">{r.type}</span>
                                        </div>
                                        {r.description && <p className="text-sm text-foreground/80">{r.description}</p>}
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}


