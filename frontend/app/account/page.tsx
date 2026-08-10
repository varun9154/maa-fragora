"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowRight,
  ChevronRight,
  Heart,
  LogIn,
  LogOut,
  Package,
  ShoppingBag,
  Sparkles,
  User,
  UserPlus,
} from "lucide-react";

import toast from "react-hot-toast";

import api from "@/lib/api";

type UserData = {
  id?: string;
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
};

export default function AccountPage() {
  const router = useRouter();

  const [user, setUser] =
    useState<UserData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [loggingOut, setLoggingOut] =
    useState(false);

  /*
  |--------------------------------------------------------------------------
  | LOAD CUSTOMER
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const loadUser = () => {
      try {
        const token =
          localStorage.getItem("token");

        const storedUser =
          localStorage.getItem("user");

        if (
          token &&
          storedUser
        ) {
          try {
            const parsedUser =
              JSON.parse(
                storedUser
              );

            setUser(parsedUser);
          } catch (error) {
            console.error(
              "Unable to parse stored user:",
              error
            );

            localStorage.removeItem(
              "user"
            );
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error(
          "Account loading error:",
          error
        );

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | LOGOUT
  |--------------------------------------------------------------------------
  */

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      /*
       * Backend logout
       *
       * Your backend logout endpoint exists,
       * but JWT authentication is primarily
       * handled by removing the token locally.
       */

      try {
        await api.post(
          "/auth/logout"
        );
      } catch (error) {
        /*
         * Even if backend logout fails,
         * we still remove the local token.
         */
        console.warn(
          "Backend logout request failed:",
          error
        );
      }

      /*
       * Remove authentication data
       */

      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "user"
      );

      /*
       * Remove optional redirect
       */

      sessionStorage.removeItem(
        "redirectAfterLogin"
      );

      /*
       * Update UI
       */

      setUser(null);

      toast.success(
        "You have been logged out."
      );

      router.refresh();

    } catch (error) {
      console.error(
        "Logout error:",
        error
      );

      /*
       * Safety fallback
       */

      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "user"
      );

      setUser(null);

      toast.success(
        "You have been logged out."
      );

      router.refresh();

    } finally {
      setLoggingOut(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050505] text-white">

        <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6">

          <div className="text-center">

            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-[#D4AF37]" />

            <p className="mt-5 text-sm text-gray-500">
              Loading your account...
            </p>

          </div>

        </div>

      </main>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | NOT LOGGED IN
  |--------------------------------------------------------------------------
  */

  if (!user) {
    return (
      <main className="min-h-screen bg-[#050505] text-white">

        {/* =========================================================
            HERO
        ========================================================= */}

        <section className="relative overflow-hidden">

          {/* Decorative glow */}

          <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[#D4AF37]/5 blur-[120px]" />

          <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">

            <div className="mx-auto max-w-3xl text-center">

              <div className="mb-6 flex justify-center">

                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10">

                  <User
                    size={28}
                    className="text-[#D4AF37]"
                  />

                </div>

              </div>

              <p className="uppercase tracking-[7px] text-[#D4AF37]">
                MAA FRAGORA
              </p>

              <h1 className="mt-5 text-5xl font-bold md:text-7xl">
                My Account
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-gray-400 md:text-lg">
                Sign in to manage your orders,
                wishlist and personal details.
                New to MAA Fragora? Create your
                account and discover our luxury
                fragrances.
              </p>

            </div>

          </div>

        </section>

        {/* =========================================================
            LOGIN / REGISTER
        ========================================================= */}

        <section className="mx-auto max-w-6xl px-6 pb-24">

          <div className="grid gap-6 md:grid-cols-2">

            {/* =====================================================
                LOGIN
            ===================================================== */}

            <div className="group rounded-[2rem] border border-white/10 bg-[#111111] p-8 transition duration-300 hover:border-[#D4AF37]/40 hover:bg-[#141414] md:p-10">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D4AF37]/10">

                <LogIn
                  size={25}
                  className="text-[#D4AF37]"
                />

              </div>

              <h2 className="mt-7 text-3xl font-bold">
                Already a customer?
              </h2>

              <p className="mt-4 leading-7 text-gray-400">
                Sign in to your MAA Fragora
                account to view your orders,
                wishlist and account details.
              </p>

              <Link
                href="/login"
                className="mt-8 flex w-full items-center justify-center gap-3 rounded-full bg-[#D4AF37] px-6 py-4 font-bold text-black transition hover:scale-[1.02] hover:shadow-[0_12px_40px_rgba(212,175,55,.20)]"
              >
                Login

                <ArrowRight
                  size={18}
                />

              </Link>

            </div>

            {/* =====================================================
                REGISTER
            ===================================================== */}

            <div className="group rounded-[2rem] border border-white/10 bg-[#111111] p-8 transition duration-300 hover:border-[#D4AF37]/40 hover:bg-[#141414] md:p-10">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5">

                <UserPlus
                  size={25}
                  className="text-[#D4AF37]"
                />

              </div>

              <h2 className="mt-7 text-3xl font-bold">
                New to MAA Fragora?
              </h2>

              <p className="mt-4 leading-7 text-gray-400">
                Create your customer account
                and enjoy a personalized shopping
                experience with MAA Fragora.
              </p>

              <Link
                href="/register"
                className="mt-8 flex w-full items-center justify-center gap-3 rounded-full border border-[#D4AF37] px-6 py-4 font-bold text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-black"
              >
                Create Account

                <ArrowRight
                  size={18}
                />

              </Link>

            </div>

          </div>

          {/* =========================================================
              BENEFITS
          ========================================================= */}

          <div className="mt-10 grid gap-4 sm:grid-cols-3">

            <div className="rounded-2xl border border-white/10 bg-[#0d0d0d] p-6">

              <Package
                size={22}
                className="text-[#D4AF37]"
              />

              <h3 className="mt-4 font-semibold">
                Track Orders
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Keep track of your perfume
                purchases and order status.
              </p>

            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0d0d0d] p-6">

              <Heart
                size={22}
                className="text-[#D4AF37]"
              />

              <h3 className="mt-4 font-semibold">
                Your Wishlist
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Save fragrances you love
                and come back to them later.
              </p>

            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0d0d0d] p-6">

              <Sparkles
                size={22}
                className="text-[#D4AF37]"
              />

              <h3 className="mt-4 font-semibold">
                Premium Experience
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Enjoy a personalized MAA Fragora
                shopping experience.
              </p>

            </div>

          </div>

          {/* =========================================================
              CONTINUE SHOPPING
          ========================================================= */}

          <div className="mt-10 text-center">

            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-[#D4AF37]"
            >
              Continue Shopping

              <ArrowRight
                size={15}
              />

            </Link>

          </div>

        </section>

      </main>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | LOGGED-IN CUSTOMER ACCOUNT
  |--------------------------------------------------------------------------
  */

  const customerName =
    user.name?.trim() ||
    "Customer";

  const customerInitial =
    customerName
      .charAt(0)
      .toUpperCase();

  return (
    <main className="min-h-screen bg-[#050505] text-white">

      {/* =========================================================
          ACCOUNT HEADER
      ========================================================= */}

      <section className="border-b border-white/10 bg-[#080808]">

        <div className="mx-auto max-w-7xl px-6 py-16">

          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">

            <div className="flex items-center gap-5">

              {/* Avatar */}

              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#D4AF37] text-3xl font-bold text-black">

                {customerInitial}

              </div>

              <div>

                <p className="text-sm uppercase tracking-[4px] text-[#D4AF37]">
                  MAA FRAGORA
                </p>

                <h1 className="mt-2 text-4xl font-bold md:text-5xl">
                  Welcome,{" "}
                  {customerName}
                </h1>

                <p className="mt-2 text-gray-500">
                  Manage your account and
                  fragrance purchases.
                </p>

              </div>

            </div>

            {/* Logout */}

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center justify-center gap-2 rounded-full border border-red-500/30 px-6 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
            >

              <LogOut
                size={17}
              />

              {loggingOut
                ? "Logging out..."
                : "Logout"}

            </button>

          </div>

        </div>

      </section>

      {/* =========================================================
          CUSTOMER CONTENT
      ========================================================= */}

      <section className="mx-auto max-w-7xl px-6 py-12">

        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">

          {/* =======================================================
              LEFT
          ======================================================= */}

          <div className="space-y-6">

            {/* =====================================================
                ACCOUNT DETAILS
            ===================================================== */}

            <div className="rounded-[2rem] border border-white/10 bg-[#111111] p-8">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm uppercase tracking-[3px] text-[#D4AF37]">
                    Profile
                  </p>

                  <h2 className="mt-2 text-2xl font-bold">
                    Account Details
                  </h2>

                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5">

                  <User
                    size={21}
                    className="text-[#D4AF37]"
                  />

                </div>

              </div>

              <div className="mt-8 grid gap-5 md:grid-cols-2">

                {/* NAME */}

                <div className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-5">

                  <p className="text-xs uppercase tracking-[2px] text-gray-600">
                    Full Name
                  </p>

                  <p className="mt-2 font-semibold">
                    {user.name ||
                      "Not available"}
                  </p>

                </div>

                {/* EMAIL */}

                <div className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-5">

                  <p className="text-xs uppercase tracking-[2px] text-gray-600">
                    Email
                  </p>

                  <p className="mt-2 break-all font-semibold">
                    {user.email ||
                      "Not available"}
                  </p>

                </div>

                {/* PHONE */}

                <div className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-5">

                  <p className="text-xs uppercase tracking-[2px] text-gray-600">
                    Phone
                  </p>

                  <p className="mt-2 font-semibold">
                    {user.phone ||
                      "Not added"}
                  </p>

                </div>

                {/* ACCOUNT TYPE */}

                <div className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-5">

                  <p className="text-xs uppercase tracking-[2px] text-gray-600">
                    Account Type
                  </p>

                  <p className="mt-2 font-semibold capitalize text-[#D4AF37]">
                    {user.role ||
                      "Customer"}
                  </p>

                </div>

              </div>

            </div>

            {/* =====================================================
                ORDERS
            ===================================================== */}

            <Link
              href="/orders"
              className="group flex items-center justify-between rounded-[2rem] border border-white/10 bg-[#111111] p-7 transition hover:border-[#D4AF37]/40 hover:bg-[#141414]"
            >

              <div className="flex items-center gap-5">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D4AF37]/10">

                  <Package
                    size={25}
                    className="text-[#D4AF37]"
                  />

                </div>

                <div>

                  <h2 className="text-xl font-bold">
                    My Orders
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    View your orders and
                    track their status.
                  </p>

                </div>

              </div>

              <ChevronRight
                size={22}
                className="text-gray-500 transition group-hover:translate-x-1 group-hover:text-[#D4AF37]"
              />

            </Link>

            {/* =====================================================
                WISHLIST
            ===================================================== */}

            <Link
              href="/wishlist"
              className="group flex items-center justify-between rounded-[2rem] border border-white/10 bg-[#111111] p-7 transition hover:border-[#D4AF37]/40 hover:bg-[#141414]"
            >

              <div className="flex items-center gap-5">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D4AF37]/10">

                  <Heart
                    size={25}
                    className="text-[#D4AF37]"
                  />

                </div>

                <div>

                  <h2 className="text-xl font-bold">
                    My Wishlist
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    View the fragrances
                    you saved.
                  </p>

                </div>

              </div>

              <ChevronRight
                size={22}
                className="text-gray-500 transition group-hover:translate-x-1 group-hover:text-[#D4AF37]"
              />

            </Link>

          </div>

          {/* =======================================================
              RIGHT SIDEBAR
          ======================================================= */}

          <aside className="space-y-5">

            {/* SHOP */}

            <Link
              href="/shop"
              className="group block rounded-[2rem] border border-[#D4AF37]/20 bg-gradient-to-br from-[#17130a] to-[#111111] p-7 transition hover:border-[#D4AF37]/50"
            >

              <ShoppingBag
                size={25}
                className="text-[#D4AF37]"
              />

              <h3 className="mt-5 text-xl font-bold">
                Explore Fragrances
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Discover your next signature
                scent from our collection.
              </p>

              <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-[#D4AF37]">

                Shop Now

                <ArrowRight
                  size={16}
                  className="transition group-hover:translate-x-1"
                />

              </div>

            </Link>

            {/* CART */}

            <Link
              href="/cart"
              className="group flex items-center justify-between rounded-[2rem] border border-white/10 bg-[#111111] p-6 transition hover:border-[#D4AF37]/40"
            >

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5">

                  <ShoppingBag
                    size={21}
                    className="text-[#D4AF37]"
                  />

                </div>

                <div>

                  <h3 className="font-semibold">
                    Shopping Cart
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    View your selected items
                  </p>

                </div>

              </div>

              <ChevronRight
                size={19}
                className="text-gray-500 group-hover:text-[#D4AF37]"
              />

            </Link>

            {/* LOGOUT CARD */}

            <div className="rounded-[2rem] border border-white/10 bg-[#0d0d0d] p-6">

              <p className="text-sm text-gray-500">
                Signed in as
              </p>

              <p className="mt-2 break-all text-sm font-semibold">
                {user.email}
              </p>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-full border border-white/10 py-3 text-sm text-gray-400 transition hover:border-red-500/30 hover:text-red-400 disabled:opacity-50"
              >

                <LogOut
                  size={16}
                />

                Logout

              </button>

            </div>

          </aside>

        </div>

      </section>

    </main>
  );
}