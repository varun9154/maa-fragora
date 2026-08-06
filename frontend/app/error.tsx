"use client";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({
  error,
  reset,
}: ErrorProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050505] px-6">

      <div className="max-w-lg rounded-3xl border border-red-500 bg-[#111111] p-10 text-center">

        <h1 className="text-5xl font-bold text-red-500">
          Oops!
        </h1>

        <p className="mt-6 text-gray-300">
          {error.message}
        </p>

        <button
          onClick={reset}
          className="mt-8 rounded-full bg-[#D4AF37] px-8 py-4 font-bold text-black"
        >
          Try Again
        </button>

      </div>

    </div>
  );
}