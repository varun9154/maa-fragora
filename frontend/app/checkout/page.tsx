import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function CheckoutPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center">

        <div className="text-center">

          <h1 className="text-6xl font-bold text-[#D4AF37]">
            Checkout
          </h1>

          <p className="mt-6 text-gray-400">
            Secure Payment Gateway
          </p>

        </div>

      </main>

      <Footer />
    </>
  );
}