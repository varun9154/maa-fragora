import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

type Props = {
  params: {
    slug: string;
  };
};

export default function ProductPage({ params }: Props) {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center">

        <div className="text-center">

          <h1 className="text-5xl font-bold text-[#D4AF37]">
            {params.slug}
          </h1>

          <p className="mt-6 text-gray-400">
            Product Details Coming Soon
          </p>

        </div>

      </main>

      <Footer />
    </>
  );
}