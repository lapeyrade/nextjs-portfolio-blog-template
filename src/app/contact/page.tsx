import Footer from '@/components/Footer'
import SiteHeader from '@/components/SiteHeader'
import ContactForm from '@/components/ContactForm'
import Link from 'next/link'
import { PageTransition, FadeInUp, ScrollReveal, AnimatedButton } from '@/components/animations'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import MobileMenu from '@/components/MobileMenu'

export const metadata = {
    title: 'Contact - Portfolio',
    description: 'Get in touch with me to discuss your next project',
}

export default function ContactPage() {
    return (
        <PageTransition>
            <div className="min-h-screen theme-surface">
                <SiteHeader />

                {/* Hero Section */}
                <section className="px-6 py-16">
                    <div className="max-w-4xl mx-auto text-center">
                        <FadeInUp delay={0.2}>
                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                                Let&apos;s Work{' '}
                                <span className="text-accent-gradient">
                                    Together
                                </span>
                            </h1>
                        </FadeInUp>
                        <FadeInUp delay={0.4}>
                            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                                Have a project in mind? I&apos;d love to hear about it and discuss how we can bring your ideas to life.
                            </p>
                        </FadeInUp>
                    </div>
                </section>

                {/* Contact Form Section */}
                <section className="px-6 py-20">
                    <div className="max-w-6xl mx-auto">
                        <ScrollReveal delay={0.2}>
                            <ContactForm />
                        </ScrollReveal>
                    </div>
                </section>



                {/* Call to Action */}
                <section className="px-6 py-16 bg-gray-900/50">
                    <div className="max-w-4xl mx-auto text-center">
                        <ScrollReveal>
                            <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Project?</h2>
                        </ScrollReveal>
                        <ScrollReveal delay={0.2}>
                            <p className="text-gray-300 mb-8">
                                Let&apos;s discuss your ideas and create something amazing together.
                            </p>
                        </ScrollReveal>
                        <ScrollReveal delay={0.4}>
                            <AnimatedButton
                                href="/#projects"
                                className="inline-block btn-accent text-white px-8 py-3 rounded-lg font-semibold"
                            >
                                View My Work
                            </AnimatedButton>
                        </ScrollReveal>
                    </div>
                </section>

                <Footer />
            </div>
        </PageTransition>
    )
}
