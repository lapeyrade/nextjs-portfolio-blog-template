'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface StaggerItemProps {
    children: ReactNode
    className?: string
}

export default function StaggerItem({ children, className = '' }: StaggerItemProps) {
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
        },
    }

    return (
        <motion.div
            className={className}
            variants={itemVariants}
            transition={{ duration: 0.6 }}
        >
            {children}
        </motion.div>
    )
}
