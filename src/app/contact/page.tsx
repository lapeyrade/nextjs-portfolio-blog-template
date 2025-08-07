import ContactForm from '@/components/ContactForm'
import Link from 'next/link'

export const metadata = {
    title: 'Contact - Portfolio',
    description: 'Get in touch with me to discuss your next project',
}

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Navigation */}
            <nav className="p-6">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <Link href="/" className="text-2xl font-bold text-white hover:text-purple-400 transition-colors">
                        Portfolio
                    </Link>
                    <div className="hidden md:flex space-x-8">
                        <Link href="/#about" className="text-gray-300 hover:text-white transition-colors">About</Link>
                        <Link href="/#projects" className="text-gray-300 hover:text-white transition-colors">Projects</Link>
                        <Link href="/contact" className="text-purple-400 font-semibold">Contact</Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="px-6 py-16">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        Let&apos;s Work{' '}
                        <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Together
                        </span>
                    </h1>
                    <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        Have a project in mind? I&apos;d love to hear about it and discuss how we can bring your ideas to life.
                    </p>
                </div>
            </section>

            {/* Contact Form Section */}
            <section className="px-6 py-20">
                <div className="max-w-6xl mx-auto">
                    <ContactForm />
                </div>
            </section>



            {/* Call to Action */}
            <section className="px-6 py-16 bg-gray-900/50">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Project?</h2>
                    <p className="text-gray-300 mb-8">
                        Let&apos;s discuss your ideas and create something amazing together.
                    </p>
                    <Link
                        href="/#projects"
                        className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-transform"
                    >
                        View My Work
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="px-6 py-8 border-t border-gray-800">
                <div className="max-w-6xl mx-auto text-center text-gray-400">
                    <p>&copy; 2024 Your Portfolio. Built with Next.js 15 and TailwindCSS.</p>
                </div>
            </footer>
        </div>
    )
}
