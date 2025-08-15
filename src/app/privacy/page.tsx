import Link from 'next/link'
import { PageTransition, FadeInUp } from '@/components/animations'
import Footer from '@/components/Footer'
import SiteHeader from '@/components/SiteHeader'

export const metadata = {
    title: 'Privacy Policy',
    description: 'How we collect, use, and protect your data.',
}

export default function PrivacyPage() {
    return (
        <PageTransition>
            <div className="min-h-screen theme-surface">
                <SiteHeader variant="dark" />

                <main className="px-6 py-16">
                    <div className="max-w-3xl mx-auto">
                        <FadeInUp>
                            <h1 className="text-4xl font-bold text-white mb-6">Privacy Policy</h1>
                        </FadeInUp>
                        <div className="max-w-none">
                            <h2 className="text-2xl font-semibold text-white mt-8 mb-3">1. Information We Collect</h2>
                            <p className="text-gray-300 mb-4">We may collect personal information such as your name, email address, and message content when you contact us through the site.</p>

                            <h2 className="text-2xl font-semibold text-white mt-8 mb-3">2. How We Use Your Information</h2>
                            <p className="text-gray-300 mb-4">We use the information to respond to inquiries, improve the site, and provide requested services. We do not sell your data.</p>

                            <h2 className="text-2xl font-semibold text-white mt-8 mb-3">3. Cookies & Analytics</h2>
                            <p className="text-gray-300 mb-4">This site may use cookies or similar technologies for performance measurements (e.g., Web Vitals). You can control cookies via your browser settings.</p>

                            <h2 className="text-2xl font-semibold text-white mt-8 mb-3">4. Data Retention</h2>
                            <p className="text-gray-300 mb-4">We retain personal data only as long as necessary to fulfill the purposes described in this policy or as required by law.</p>

                            <h2 className="text-2xl font-semibold text-white mt-8 mb-3">5. Your Rights</h2>
                            <p className="text-gray-300 mb-4">You may request access, correction, or deletion of your personal data. Contact us to exercise your rights.</p>

                            <h2 className="text-2xl font-semibold text-white mt-8 mb-3">6. Contact</h2>
                            <p className="text-gray-300 mb-4">Questions about this policy? <Link href="/contact" className="text-accent hover:text-accent-strong">Contact me</Link>.</p>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </PageTransition>
    )
}


