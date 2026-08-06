"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#050505] text-white">

        <section className="mx-auto max-w-6xl px-6 py-20">

          <h1 className="mb-12 text-center text-5xl font-bold">
            Contact Us
          </h1>

          <div className="grid gap-12 lg:grid-cols-2">

            <form className="space-y-6 rounded-3xl border border-white/10 bg-[#111111] p-8">

              <input
                placeholder="Your Name"
                className="w-full rounded-xl bg-[#181818] p-4"
              />

              <input
                type="email"
                placeholder="Email"
                className="w-full rounded-xl bg-[#181818] p-4"
              />

              <input
                placeholder="Subject"
                className="w-full rounded-xl bg-[#181818] p-4"
              />

              <textarea
                rows={6}
                placeholder="Message"
                className="w-full rounded-xl bg-[#181818] p-4"
              />

              <button className="w-full rounded-full bg-[#D4AF37] py-4 font-bold text-black">
                Send Message
              </button>

            </form>

            <div className="space-y-8">

              <div className="flex gap-5">

                <Mail className="text-[#D4AF37]" />

                <div>

                  <h2>Email</h2>

                  <p className="text-gray-400">
                    support@maafragora.com
                  </p>

                </div>

              </div>

              <div className="flex gap-5">

                <Phone className="text-[#D4AF37]" />

                <div>

                  <h2>Phone</h2>

                  <p className="text-gray-400">
                    +91 9876543210
                  </p>

                </div>

              </div>

              <div className="flex gap-5">

                <MapPin className="text-[#D4AF37]" />

                <div>

                  <h2>Address</h2>

                  <p className="text-gray-400">
                    Hyderabad, Telangana, India
                  </p>

                </div>

              </div>

            </div>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}