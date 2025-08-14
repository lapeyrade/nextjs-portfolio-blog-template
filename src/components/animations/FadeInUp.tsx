'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ReactNode } from 'react'

interface FadeInUpProps {
    children: ReactNode
    delay?: number
    duration?: number
    className?: string
}

export default function FadeInUp({
    children,
    delay = 0,
    duration = 0.6,
    className = ''
}: FadeInUpProps) {
    const prefersReducedMotion = useReducedMotion()

    const initialState = prefersReducedMotion
        ? { opacity: 0 }
        : { opacity: 0, y: 60 }

    const animateState = { opacity: 1, y: 0 }

    return (
        <motion.div
            className={`cv-auto ${className}`}
            initial={initialState}
            whileInView={animateState}
            viewport={{ once: true, amount: 0.2 }}
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
