import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Image from "next/image";

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#050505] text-white">

        <section className="mx-auto max-w-7xl px-6 py-20">

          <div className="grid items-center gap-16 lg:grid-cols-2">

            <div>

              <span className="rounded-full border border-[#D4AF37] px-4 py-2 text-sm uppercase tracking-[4px] text-[#D4AF37]">
                About Maa Fragora
              </span>

              <h1 className="mt-8 text-5xl font-bold leading-tight">
                Luxury Fragrances Crafted With Passion
              </h1>

              <p className="mt-8 text-lg leading-8 text-gray-400">
                Maa Fragora brings together elegance, sophistication,
                and long-lasting fragrances. Every perfume is carefully
                selected to create unforgettable experiences.
              </p>

              <p className="mt-6 text-lg leading-8 text-gray-400">
                Our mission is to make premium perfumes affordable while
                maintaining world-class quality and luxury packaging.
              </p>

            </div>

            <div className="relative h-[600px] overflow-hidden rounded-3xl">

              <Image
                src="/images/about/about.jpg"
                alt="About Maa Fragora"
                fill
                className="object-cover"
                sizes="(max-width:1024px)100vw,50vw"
              />

            </div>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}