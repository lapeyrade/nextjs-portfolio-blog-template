'use client'

import { motion, useInView, useReducedMotion } from 'framer-motion'
import { ReactNode, useRef } from 'react'

interface ScrollRevealProps {
    children: ReactNode
    delay?: number
    duration?: number
    direction?: 'up' | 'down' | 'left' | 'right'
    className?: string
}

export default function ScrollReveal({
    children,
    delay = 0,
    duration = 0.6,
    direction = 'up',
    className = ''
}: ScrollRevealProps) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.1 })
    const prefersReducedMotion = useReducedMotion()

    const directionOffset = {
        up: { y: 60, x: 0 },
        down: { y: -60, x: 0 },
        left: { y: 0, x: 60 },
        right: { y: 0, x: -60 },
    }

    const { x, y } = directionOffset[direction]

    return (
        <motion.div
            ref={ref}
            className={`cv-auto ${className}`}
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x, y }}
            animate={isInView ? { opacity: 1, x: 0, y: 0 } : prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x, y }}
            transition={{
                duration: prefersReducedMotion ? 0.01 : duration,
                delay: prefersReducedMotion ? 0 : delay,
                ease: [0.6, -0.05, 0.01, 0.99],
            }}
        >
            {children}
        </motion.div>
    )
}
