import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-stone-50 text-stone-900">
      <h2 className="text-2xl font-bold text-[#1c2a17] mb-2">Page Not Found</h2>
      <p className="text-stone-600 mb-4 text-sm">Could not find requested resource</p>
      <Link
        href="/"
        className="px-4 py-2 bg-[#3E6B2B] text-white text-xs font-semibold rounded-lg hover:bg-[#335a23] transition"
      >
        Return to Dashboard
      </Link>
    </div>
  );
}
