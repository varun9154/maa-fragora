import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import ProfileCard from "@/components/profile/ProfileCard";
import ProfileMenu from "@/components/profile/ProfileMenu";

export default function ProfilePage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#050505] text-white">

        <section className="mx-auto max-w-7xl px-6 py-20">

          <h1 className="mb-12 text-5xl font-bold">
            My Profile
          </h1>

          <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">

            <ProfileCard />

            <ProfileMenu />

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}