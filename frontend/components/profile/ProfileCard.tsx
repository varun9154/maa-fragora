"use client";

import { useAuthStore } from "../../store/authStore";

export default function ProfileCard() {
  const { user, logout } = useAuthStore();

  return (
    <div className="rounded-3xl border border-white/10 bg-[#111111] p-8">

      <div className="flex items-center gap-5">

        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#D4AF37] text-3xl font-bold text-black">
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>

        <div>
          <h2 className="text-3xl font-bold text-white">
            {user?.name || "Guest User"}
          </h2>

          <p className="mt-2 text-gray-400">
            {user?.email || "guest@example.com"}
          </p>
        </div>

      </div>

      <button
        onClick={logout}
        className="mt-10 w-full rounded-full bg-red-600 py-4 font-semibold text-white transition hover:bg-red-700"
      >
        Logout
      </button>

    </div>
  );
}