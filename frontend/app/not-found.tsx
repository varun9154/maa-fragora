import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050505] px-6">

      <div className="text-center">

        <h1 className="text-8xl font-bold text-[#D4AF37]">
          404
        </h1>

        <h2 className="mt-6 text-4xl font-bold text-white">
          Page Not Found
        </h2>

       <p className="mt-4 text-gray-400">
  Sorry, the page you requested does not exist.
</p>

        <Link
          href="/"
          className="mt-10 inline-block rounded-full bg-[#D4AF37] px-8 py-4 font-bold text-black"
        >
          Back to Home
        </Link>

      </div>

    </div>
  );
}