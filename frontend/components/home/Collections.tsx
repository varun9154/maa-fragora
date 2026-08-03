import GlassCard from "@/components/ui/GlassCard";
import SectionTitle from "@/components/ui/SectionTitle";

const collections = [
  {
    title: "Men",
    image:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800",
  },
  {
    title: "Women",
    image:
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800",
  },
  {
    title: "Unisex",
    image:
      "https://images.unsplash.com/photo-1615634262417-9f0c5d1eaf1f?w=800",
  },
];

export default function Collections() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-28">

      <SectionTitle
        subtitle="Collections"
        title="Luxury Collections"
      />

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {collections.map((item) => (
          <GlassCard
            key={item.title}
            title={item.title}
            image={item.image}
          />
        ))}
      </div>

    </section>
  );
}