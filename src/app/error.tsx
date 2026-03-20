'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-void">
      <h1 className="text-4xl font-black text-neutral-900">Something went wrong</h1>
      <p className="mt-2 text-sm text-neutral-500">{error.message}</p>
      <button onClick={reset} className="mt-6 rounded-xl bg-lime px-6 py-2 text-sm font-black text-black">
        Try Again
      </button>
    </div>
  );
}
