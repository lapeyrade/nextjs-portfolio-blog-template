'use client'

import dynamic from 'next/dynamic'
import type { ComponentProps } from 'react'

const Impl = dynamic(() => import('../ScrollReveal'), {
    ssr: false,
    loading: () => <div />,
})

export default function ScrollReveal(props: ComponentProps<typeof Impl>) {
    return <Impl {...props} />
}


