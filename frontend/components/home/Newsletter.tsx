export default function Newsletter() {
  return (
    <section className="py-24 bg-[#0F0F0F]">
      <div className="mx-auto max-w-4xl rounded-3xl border border-[#D4AF37]/20 bg-[#151515] p-12 text-center">

        <p className="tracking-[6px] uppercase text-[#D4AF37]">
          Stay Updated
        </p>

        <h2 className="mt-4 text-5xl font-bold">
          Join the MAA Fragora Family
        </h2>

        <p className="mt-6 text-gray-400">
          Be the first to know about new fragrance launches, exclusive offers,
          and premium collections.
        </p>

        <div className="mt-10 flex flex-col gap-4 md:flex-row">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 rounded-full border border-white/10 bg-[#090909] px-6 py-4 outline-none focus:border-[#D4AF37]"
          />

          <button className="rounded-full bg-[#D4AF37] px-8 py-4 font-semibold text-black transition hover:scale-105">
            Subscribe
          </button>
        </div>

      </div>
    </section>
  );
}