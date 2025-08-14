'use client'

import dynamic from 'next/dynamic'
import type { ComponentProps } from 'react'

const Impl = dynamic(() => import('../FadeInUp'), {
    ssr: false,
    loading: () => <div />,
})

export default function FadeInUp(props: ComponentProps<typeof Impl>) {
    return <Impl {...props} />
}


