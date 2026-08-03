import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";

import Hero from "@/components/home/Hero";
import Collections from "@/components/home/Collections";
import BestSellers from "@/components/home/BestSellers";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";

import Footer from "@/components/layout/Footer";

import WhatsAppButton from "@/components/common/WhatsAppButton";
import ScrollToTop from "@/components/common/ScrollToTop";

export default function Home() {
  return (
    <main className="bg-[#090909] text-white">

      <TopBar />

      <Navbar />

      <Hero />

      <Collections />

      <BestSellers />

      <WhyChooseUs />

      <Testimonials />

      <Newsletter />

      <Footer />

      <WhatsAppButton />

      <ScrollToTop />

    </main>
  );
}