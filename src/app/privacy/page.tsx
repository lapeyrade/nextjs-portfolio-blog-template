import Link from 'next/link'
import { PageTransition, FadeInUp } from '@/components/animations'

export const metadata = {
    title: 'Privacy Policy',
    description: 'How we collect, use, and protect your data.',
}

export default function PrivacyPage() {
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
                    </div>
                </nav>

                <main className="px-6 py-16">
                    <div className="max-w-3xl mx-auto">
                        <FadeInUp>
                            <h1 className="text-4xl font-bold text-foreground mb-6">Privacy Policy</h1>
                        </FadeInUp>
                        <div className="max-w-none">
                            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-3">1. Information We Collect</h2>
                            <p className="text-foreground/90 mb-4">We may collect personal information such as your name, email address, and message content when you contact us through the site.</p>

                            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-3">2. How We Use Your Information</h2>
                            <p className="text-foreground/90 mb-4">We use the information to respond to inquiries, improve the site, and provide requested services. We do not sell your data.</p>

                            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-3">3. Cookies & Analytics</h2>
                            <p className="text-foreground/90 mb-4">This site may use cookies or similar technologies for performance measurements (e.g., Web Vitals). You can control cookies via your browser settings.</p>

                            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-3">4. Data Retention</h2>
                            <p className="text-foreground/90 mb-4">We retain personal data only as long as necessary to fulfill the purposes described in this policy or as required by law.</p>

                            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-3">5. Your Rights</h2>
                            <p className="text-foreground/90 mb-4">You may request access, correction, or deletion of your personal data. Contact us to exercise your rights.</p>

                            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-3">6. Contact</h2>
                            <p className="text-foreground/90 mb-4">Questions about this policy? <Link href="/contact" className="text-accent hover:text-accent-strong">Contact me</Link>.</p>
                        </div>
                    </div>
                </main>
            </div>
        </PageTransition>
    )
}


