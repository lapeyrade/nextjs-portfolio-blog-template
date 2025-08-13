import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="px-6 py-8 border-t border-gray-800">
            <div className="max-w-6xl mx-auto text-center text-gray-400">
                <div className="inline-flex items-center gap-6">
                    <Link href="/cgu" className="hover:text-gray-200">Terms</Link>
                    <Link href="/privacy" className="hover:text-gray-200">Privacy</Link>
                    <Link href="/contact" className="hover:text-gray-200">Contact</Link>
                </div>
                <p className="mt-2">&copy; {new Date().getFullYear()} Your Portfolio.</p>
            </div>
        </footer>
    )
}


