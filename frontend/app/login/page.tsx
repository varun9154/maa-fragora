"use client";

import {
  FormEvent,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Eye,
  EyeOff,
  ArrowLeft,
  LogIn,
  Sparkles,
} from "lucide-react";

import toast from "react-hot-toast";

import api from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (
    e: FormEvent
  ) => {
    e.preventDefault();

    const cleanEmail =
      email.trim().toLowerCase();

    const cleanPassword =
      password;

    if (!cleanEmail) {
      toast.error(
        "Please enter your email."
      );
      return;
    }

    if (!cleanPassword) {
      toast.error(
        "Please enter your password."
      );
      return;
    }

    try {
      setLoading(true);

      console.log(
        "LOGIN REQUEST:",
        {
          email: cleanEmail,
        }
      );

      const response =
        await api.post(
          "/auth/login",
          {
            email: cleanEmail,
            password:
              cleanPassword,
          }
        );

      console.log(
        "LOGIN RESPONSE:",
        response.data
      );

      if (
        !response.data?.success ||
        !response.data?.token
      ) {
        throw new Error(
          response.data?.message ||
            "Login failed"
        );
      }

      /*
       * Save JWT
       */

      localStorage.setItem(
        "token",
        response.data.token
      );

      /*
       * Save customer
       */

      if (response.data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(
            response.data.user
          )
        );
      }

      /*
       * Check if customer came
       * from another protected page.
       */

      const redirect =
        sessionStorage.getItem(
          "redirectAfterLogin"
        );

      sessionStorage.removeItem(
        "redirectAfterLogin"
      );

      toast.success(
        `Welcome back, ${
          response.data.user?.name ||
          "Customer"
        }!`
      );

      /*
       * Redirect
       */

      if (redirect) {
        router.push(redirect);
      } else {
        router.push("/account");
      }

    } catch (error: any) {
      console.error(
        "Login Error:",
        error
      );

      console.error(
        "Login Response:",
        error?.response?.data
      );

      const message =
        error?.response?.data
          ?.message ||
        error?.message ||
        "Invalid email or password";

      toast.error(message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white">

      {/* BACK */}

      <div className="mx-auto max-w-7xl px-6 pt-8">

        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-[#D4AF37]"
        >
          <ArrowLeft
            size={16}
          />

          Back to Account

        </Link>

      </div>

      {/* MAIN */}

      <section className="flex min-h-[calc(100vh-90px)] items-center justify-center px-6 py-16">

        <div className="w-full max-w-md">

          {/* BRAND */}

          <div className="mb-10 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10">

              <Sparkles
                size={27}
                className="text-[#D4AF37]"
              />

            </div>

            <p className="mt-6 uppercase tracking-[6px] text-[#D4AF37]">
              MAA FRAGORA
            </p>

            <h1 className="mt-3 text-4xl font-bold">
              Welcome Back
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Sign in to continue your
              luxury fragrance journey.
            </p>

          </div>

          {/* CARD */}

          <div className="rounded-[2rem] border border-white/10 bg-[#111111] p-7 shadow-2xl md:p-9">

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              {/* EMAIL */}

              <div>

                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  placeholder="you@example.com"
                  autoComplete="email"
                  disabled={loading}
                  className="w-full rounded-xl border border-white/10 bg-[#080808] px-4 py-3.5 text-white outline-none transition placeholder:text-gray-700 focus:border-[#D4AF37]"
                />

              </div>

              {/* PASSWORD */}

              <div>

                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Password
                </label>

                <div className="relative">

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={loading}
                    className="w-full rounded-xl border border-white/10 bg-[#080808] px-4 py-3.5 pr-12 text-white outline-none transition placeholder:text-gray-700 focus:border-[#D4AF37]"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-[#D4AF37]"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >

                    {showPassword ? (
                      <EyeOff
                        size={19}
                      />
                    ) : (
                      <Eye
                        size={19}
                      />
                    )}

                  </button>

                </div>

              </div>

              {/* LOGIN BUTTON */}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-full bg-[#D4AF37] py-4 font-bold text-black transition hover:scale-[1.01] hover:shadow-[0_12px_40px_rgba(212,175,55,.18)] disabled:cursor-not-allowed disabled:opacity-50"
              >

                <LogIn
                  size={18}
                />

                {loading
                  ? "Signing in..."
                  : "Sign In"}

              </button>

            </form>

            {/* REGISTER */}

            <div className="mt-8 border-t border-white/10 pt-7 text-center">

              <p className="text-sm text-gray-500">
                Don't have an account?
              </p>

              <Link
                href="/register"
                className="mt-2 inline-block font-semibold text-[#D4AF37] transition hover:text-white"
              >
                Create a new account
              </Link>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}