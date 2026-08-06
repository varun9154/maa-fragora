import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#050505] text-white">

        <div className="mx-auto max-w-xl px-6 py-24">

          <RegisterForm />

        </div>

      </main>

      <Footer />
    </>
  );
}