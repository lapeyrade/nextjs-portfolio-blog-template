import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="px-6 py-8 border-t border-gray-800">
            <div className="max-w-6xl mx-auto text-center text-gray-400">
                <p>&copy; {new Date().getFullYear()} Your Portfolio. Built with Next.js 15 and TailwindCSS.</p>
                <div className="mt-2 space-x-4">
                    <Link href="/cgu" className="underline hover:text-gray-200">Terms</Link>
                    <span aria-hidden="true">·</span>
                    <Link href="/privacy" className="underline hover:text-gray-200">Privacy</Link>
                </div>
            </div>
        </footer>
    )
}


