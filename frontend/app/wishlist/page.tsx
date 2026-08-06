import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import WishlistGrid from "@/components/wishlist/WishlistGrid";

export default function WishlistPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#050505] text-white">

        <section className="mx-auto max-w-7xl px-6 py-20">

          <div className="mb-12">

            <h1 className="text-5xl font-bold">
              My Wishlist
            </h1>

            <p className="mt-3 text-gray-400">
              Your favourite luxury fragrances.
            </p>

          </div>

          <WishlistGrid />

        </section>

      </main>

      <Footer />
    </>
  );
}