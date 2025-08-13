import Link from 'next/link'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import Search from '@/components/Search'
import MobileMenu from '@/components/MobileMenu'
import SiteNavLinks from '@/components/SiteNavLinks'

interface SiteHeaderProps {
    isHome?: boolean
    variant?: 'themed' | 'dark'
    activeBlog?: boolean
}

export default function SiteHeader({ isHome = false, variant = 'themed', activeBlog = false }: SiteHeaderProps) {
    return (
        <nav className="p-6">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                <Link href="/" className={variant === 'dark' ? 'text-2xl font-bold text-white hover:text-accent transition-colors' : 'text-2xl font-bold text-foreground hover:text-accent transition-colors'}>
                    Portfolio
                </Link>

                <div className="flex items-center gap-6 md:gap-8">
                    <SiteNavLinks isHome={isHome} variant={variant} activeBlog={activeBlog} />
                    <div className="ml-2 md:ml-4">
                        <Search />
                    </div>
                    <ThemeSwitcher />
                    <MobileMenu isHome={isHome} hideBlog={activeBlog} hideAbout={isHome} />
                </div>
            </div>
        </nav>
    )
}


