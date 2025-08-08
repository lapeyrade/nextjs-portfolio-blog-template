import Link from 'next/link'
import { PageTransition, FadeInUp, AnimatedButton } from '@/components/animations'

export default function NotFound() {
    return (
        <PageTransition>
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center">
                <main className="w-full px-6 py-20">
                    <div className="max-w-3xl mx-auto text-center">
                        <FadeInUp delay={0.1}>
                            <p className="text-purple-300 font-semibold tracking-widest mb-3">404</p>
                        </FadeInUp>
                        <FadeInUp delay={0.2}>
                            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">Page not found</h1>
                        </FadeInUp>
                        <FadeInUp delay={0.3}>
                            <p className="text-gray-300 mb-10 max-w-xl mx-auto">
                                The page you are looking for doesn&apos;t exist or has been moved.
                            </p>
                        </FadeInUp>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <AnimatedButton href="/" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold">
                                Go to Homepage
                            </AnimatedButton>
                            <AnimatedButton href="/blog" className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold">
                                Visit the Blog
                            </AnimatedButton>
                            <AnimatedButton href="/contact" className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold">
                                Contact Me
                            </AnimatedButton>
                        </div>

                        <div className="mt-10 text-sm text-gray-400">
                            <Link href="/" className="underline hover:text-gray-200 transition-colors">
                                Or return to the homepage
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        </PageTransition>
    )
}


