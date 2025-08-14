'use client'

import dynamic from 'next/dynamic'
import type { ComponentProps } from 'react'

const Impl = dynamic(() => import('../StaggerContainer'), {
    ssr: false,
    loading: () => <div />,
})

export default function StaggerContainer(props: ComponentProps<typeof Impl>) {
    return <Impl {...props} />
}


