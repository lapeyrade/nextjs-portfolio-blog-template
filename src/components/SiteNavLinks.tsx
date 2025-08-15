import Link from 'next/link'
import ThemeSwitcher from '@/components/ThemeSwitcher'

interface SiteNavLinksProps {
    isHome?: boolean
    variant?: 'themed' | 'dark'
    activeBlog?: boolean
    showThemeSwitcher?: boolean
}

export default function SiteNavLinks({
    isHome = false,
    variant = 'themed',
    activeBlog = false,
    showThemeSwitcher = false,
}: SiteNavLinksProps) {
    const linkCls = variant === 'dark'
        ? 'text-gray-300 hover:text-white transition-colors'
        : 'text-gray-700 dark:text-gray-200 hover:text-accent transition-colors'

    const aboutHref = isHome ? '#about' : '/'
    const projectsHref = isHome ? '#projects' : '/#projects'
    const blogCls = activeBlog ? 'text-accent font-semibold' : linkCls

    return (
        <div className="hidden md:flex items-center space-x-8">
            {isHome ? (
                <a href={aboutHref} className={linkCls}>About</a>
            ) : (
                <Link href={aboutHref} className={linkCls}>About</Link>
            )}
            {isHome ? (
                <a href={projectsHref} className={linkCls}>Projects</a>
            ) : (
                <Link href={projectsHref} className={linkCls}>Projects</Link>
            )}
            <Link href="/blog" className={blogCls}>Blog</Link>
            <Link href="/contact" className={linkCls}>Contact</Link>
            {showThemeSwitcher && <ThemeSwitcher />}
        </div>
    )
}


