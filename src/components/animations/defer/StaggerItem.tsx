'use client'

import dynamic from 'next/dynamic'
import type { ComponentProps } from 'react'

const Impl = dynamic(() => import('../StaggerItem'), {
    ssr: false,
    loading: () => <div />,
})

export default function StaggerItem(props: ComponentProps<typeof Impl>) {
    return <Impl {...props} />
}


