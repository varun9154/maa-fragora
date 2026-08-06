"use client";

import { Globe, Mail } from "lucide-react";

export default function SocialLogin() {
  return (
    <div className="mt-8">

      <div className="relative mb-6">

        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10" />
        </div>

        <div className="relative flex justify-center">
          <span className="bg-[#111111] px-4 text-sm text-gray-400">
            OR CONTINUE WITH
          </span>
        </div>

      </div>

      <div className="grid gap-4 sm:grid-cols-2">

        <button
          type="button"
          className="flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-[#181818] px-6 py-4 text-white transition hover:border-[#D4AF37] hover:bg-[#202020]"
        >
         <Globe size={20} />
         Google
        </button>

        <button
          type="button"
          className="flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-[#181818] px-6 py-4 text-white transition hover:border-[#D4AF37] hover:bg-[#202020]"
        >
         <Mail size={20} />
        Email
        </button>

      </div>

    </div>
  );
}