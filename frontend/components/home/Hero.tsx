import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-[#090909]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#2b2b2b,transparent_60%)] opacity-50"></div>

      <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2">

        <div className="z-10 flex flex-col justify-center">

          <p className="mb-4 tracking-[8px] text-[#D4AF37]">
            LUXURY FRAGRANCES
          </p>

          <h1 className="text-6xl font-bold leading-tight lg:text-8xl">
            Experience
            <span className="block text-[#D4AF37]">
              Luxury
            </span>
            Everyday
          </h1>

          <p className="mt-8 max-w-xl text-lg text-gray-400">
            Premium inspired perfumes crafted for confidence,
            elegance and unforgettable impressions.
          </p>

          <div className="mt-10 flex gap-5">
            <Button>Shop Now</Button>
            <Button variant="outline">Explore</Button>
          </div>

        </div>

        <div className="flex items-center justify-center">

          <div className="flex h-[520px] w-[360px] items-center justify-center rounded-[40px] border border-[#D4AF37]/20 bg-gradient-to-b from-[#1f1f1f] to-black shadow-[0_0_80px_rgba(212,175,55,.25)]">

            <span className="text-2xl text-[#D4AF37]">
              3D Perfume Bottle
            </span>

          </div>

        </div>

      </div>
    </section>
  );
}