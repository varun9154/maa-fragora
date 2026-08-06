import Image from "next/image";
import Link from "next/link";

import GlassCard from "@/components/ui/GlassCard";
import SectionTitle from "@/components/ui/SectionTitle";

const collections = [
  {
    title: "Men",
    image:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800",
    href: "/shop?category=Men",
  },
  {
    title: "Women",
    image:
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800",
    href: "/shop?category=Women",
  },
  {
    title: "Unisex",
    image:
      "https://images.unsplash.com/photo-1615634262417-9f0c5d1eaf1f?w=800",
    href: "/shop?category=Unisex",
  },
];

export default function Collections() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">

      <SectionTitle
        subtitle="Collections"
        title="Luxury Collections"
      />

      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

        {collections.map((collection) => (

          <Link
            key={collection.title}
            href={collection.href}
          >
            <GlassCard className="group overflow-hidden p-0 cursor-pointer">

              <div className="relative h-96 w-full">

                <Image
                  src={collection.image}
                  alt={collection.title}
                  fill
                  sizes="(max-width:768px)100vw,(max-width:1200px)50vw,33vw"
                  className="object-cover transition duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition" />

              </div>

              <div className="p-6 text-center">

                <h3 className="text-3xl font-bold text-white">
                  {collection.title}
                </h3>

                <p className="mt-3 text-gray-300">
                  Explore Premium Fragrances
                </p>

              </div>

            </GlassCard>
          </Link>

        ))}

      </div>

    </section>
  );
}