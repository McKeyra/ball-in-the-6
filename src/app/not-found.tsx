import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-void">
      <h1 className="text-6xl font-black text-neutral-900">404</h1>
      <p className="mt-2 text-neutral-500">Page not found</p>
      <Link href="/" className="mt-6 rounded-xl bg-lime px-6 py-2 text-sm font-black text-black">
        Go Home
      </Link>
    </div>
  );
}
