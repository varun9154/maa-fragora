export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050505]">

      <div className="text-center">

        <div className="mx-auto h-20 w-20 animate-spin rounded-full border-4 border-[#D4AF37] border-t-transparent"></div>

        <h2 className="mt-8 text-2xl font-bold text-white">
          Loading...
        </h2>

        <p className="mt-3 text-gray-400">
          Preparing Luxury Experience
        </p>

      </div>

    </div>
  );
}