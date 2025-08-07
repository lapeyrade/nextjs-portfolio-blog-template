'use client'

import { useState } from 'react'
import { obfuscateEmailForDisplay, createObfuscatedMailtoLink, openObfuscatedEmail } from '@/lib/emailUtils'

interface ObfuscatedEmailProps {
    email: string
    subject?: string
    className?: string
    children?: React.ReactNode
}

export default function ObfuscatedEmail({
    email,
    subject = 'Hello from your portfolio!',
    className = '',
    children
}: ObfuscatedEmailProps) {
    const [isRevealed, setIsRevealed] = useState(false)
    const [isHovered, setIsHovered] = useState(false)

    const obfuscatedDisplay = obfuscateEmailForDisplay(email)
    const encodedMailto = createObfuscatedMailtoLink(email, subject)

    const handleEmailClick = (e: React.MouseEvent) => {
        e.preventDefault()

        if (!isRevealed) {
            // First click reveals the email
            setIsRevealed(true)
        } else {
            // Second click opens email client
            openObfuscatedEmail(encodedMailto)
        }
    }

    const handleCopyEmail = async (e: React.MouseEvent) => {
        e.stopPropagation()

        try {
            await navigator.clipboard.writeText(email)
            // You could add a toast notification here
            console.log('Email copied to clipboard')
        } catch (error) {
            console.error('Failed to copy email:', error)
        }
    }

    if (children) {
        // Render as a clickable element with custom children
        return (
            <button
                onClick={handleEmailClick}
                className={className}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                title={isRevealed ? `Click to send email to ${email}` : 'Click to reveal email'}
            >
                {children}
            </button>
        )
    }

    // Render as text with email display
    return (
        <div className="inline-flex items-center gap-2">
            <button
                onClick={handleEmailClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`${className} transition-colors duration-200 ${isHovered ? 'text-purple-400' : ''
                    }`}
                title={isRevealed ? `Click to send email to ${email}` : 'Click to reveal email'}
            >
                {isRevealed ? email : obfuscatedDisplay}
            </button>

            {isRevealed && (
                <button
                    onClick={handleCopyEmail}
                    className="ml-2 text-xs text-gray-400 hover:text-purple-400 transition-colors"
                    title="Copy email to clipboard"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                </button>
            )}
        </div>
    )
}
