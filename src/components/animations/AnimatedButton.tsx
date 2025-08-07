'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface AnimatedButtonProps {
    children: ReactNode
    className?: string
    onClick?: () => void
    href?: string
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
}

export default function AnimatedButton({
    children,
    className = '',
    onClick,
    href,
    type = 'button',
    disabled = false
}: AnimatedButtonProps) {
    const Component = href ? motion.a : motion.button

    const props = href
        ? { href }
        : { type, onClick, disabled }

    return (
        <Component
            className={className}
            whileHover={disabled ? {} : { scale: 1.05 }}
            whileTap={disabled ? {} : { scale: 0.95 }}
            transition={{ duration: 0.2 }}
            {...props}
        >
            {children}
        </Component>
    )
}
