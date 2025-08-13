import Link from 'next/link'
import { PageTransition, FadeInUp } from '@/components/animations'
import MobileMenu from '@/components/MobileMenu'

export const metadata = {
    title: 'Terms & Conditions',
    description: 'Conditions générales d’utilisation',
}

export default function CGUPage() {
    return (
        <PageTransition>
            <div className="min-h-screen theme-surface">
                <nav className="p-6">
                    <div className="max-w-6xl mx-auto flex justify-between items-center">
                        <Link href="/" className="text-2xl font-bold text-foreground hover:text-accent transition-colors">Portfolio</Link>
                        <div className="hidden md:flex items-center space-x-8">
                            <Link href="/#about" className="text-foreground hover:text-accent transition-colors">About</Link>
                            <Link href="/#projects" className="text-foreground hover:text-accent transition-colors">Projects</Link>
                            <Link href="/blog" className="text-foreground hover:text-accent transition-colors">Blog</Link>
                            <Link href="/contact" className="text-foreground hover:text-accent transition-colors">Contact</Link>
                        </div>
                        <MobileMenu />
                    </div>
                </nav>

                <main className="px-6 py-16">
                    <div className="max-w-3xl mx-auto">
                        <FadeInUp>
                            <h1 className="text-4xl font-bold text-foreground mb-6">Terms & Conditions</h1>
                        </FadeInUp>
                        <div className="max-w-none">
                            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-3">1. Acceptance of Terms</h2>
                            <p className="text-foreground/90 mb-4">By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>

                            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-3">2. Use of the Site</h2>
                            <p className="text-foreground/90 mb-4">You agree to use the site only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else’s use.</p>

                            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-3">3. Intellectual Property</h2>
                            <p className="text-foreground/90 mb-4">All content, trademarks, and data on this website, including but not limited to software, databases, text, graphics, icons, and hyperlinks are the property of their respective owners.</p>

                            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-3">4. Limitation of Liability</h2>
                            <p className="text-foreground/90 mb-4">The website owner will not be liable for any loss or damage of any nature arising from the use of or reliance on any information provided on the site.</p>

                            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-3">5. Changes to These Terms</h2>
                            <p className="text-foreground/90 mb-4">We may update our Terms from time to time. We will notify you of any changes by posting the new Terms on this page.</p>

                            <p className="text-foreground/80 mt-8">If you have questions, please <Link href="/contact" className="text-accent hover:text-accent-strong">contact me</Link>.</p>
                        </div>
                    </div>
                </main>
            </div>
        </PageTransition>
    )
}


