export const metadata = {
  title: "Offline",
};

import Link from "next/link";

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-md text-center text-gray-200">
        <h1 className="text-3xl font-bold mb-4">You are offline</h1>
        <p className="mb-6">
          It looks like you&apos;re not connected to the internet. You can continue browsing cached
          pages and try again later.
        </p>
        <Link
          href="/"
          className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
