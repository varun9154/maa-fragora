import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function WishlistPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center">

        <div className="text-center">

          <h1 className="text-6xl font-bold text-[#D4AF37]">
            Wishlist
          </h1>

          <p className="mt-6 text-gray-400">
            Save your favourite fragrances.
          </p>

        </div>

      </main>

      <Footer />
    </>
  );
}