import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <div className="text-center">

          <h1 className="text-6xl font-bold text-[#D4AF37]">
            About Us
          </h1>

          <p className="mt-6 text-gray-400">
            MAA Fragora - Luxury Within Reach
          </p>

        </div>
      </main>

      <Footer />
    </>
  );
}