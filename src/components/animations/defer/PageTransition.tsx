'use client'

import dynamic from 'next/dynamic'
import type { ComponentProps } from 'react'

const Impl = dynamic(() => import('../PageTransition'), {
    ssr: false,
    loading: () => <div />,
})

export default function PageTransition(props: ComponentProps<typeof Impl>) {
    return <Impl {...props} />
}


