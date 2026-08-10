"use client";

import {
  FormEvent,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  Eye,
  EyeOff,
  Sparkles,
  UserPlus,
} from "lucide-react";

import toast from "react-hot-toast";

import api from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (
    e: FormEvent
  ) => {
    e.preventDefault();

    const cleanName =
      name.trim();

    const cleanEmail =
      email.trim().toLowerCase();

    const cleanPhone =
      phone.trim();

    if (!cleanName) {
      toast.error(
        "Please enter your name."
      );
      return;
    }

    if (!cleanEmail) {
      toast.error(
        "Please enter your email."
      );
      return;
    }

    if (
      cleanPhone &&
      !/^[0-9]{10}$/.test(
        cleanPhone
      )
    ) {
      toast.error(
        "Enter a valid 10 digit phone number."
      );
      return;
    }

    if (password.length < 6) {
      toast.error(
        "Password must contain at least 6 characters."
      );
      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      toast.error(
        "Passwords do not match."
      );
      return;
    }

    try {
      setLoading(true);

      console.log(
        "REGISTER REQUEST:",
        {
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
        }
      );

      const response =
        await api.post(
          "/auth/register",
          {
            name: cleanName,
            email: cleanEmail,
            password,
            phone:
              cleanPhone || undefined,
          }
        );

      console.log(
        "REGISTER RESPONSE:",
        response.data
      );

      if (
        !response.data?.success ||
        !response.data?.token
      ) {
        throw new Error(
          response.data?.message ||
            "Registration failed"
        );
      }

      /*
       * IMPORTANT:
       * Save token returned by backend.
       */

      localStorage.setItem(
        "token",
        response.data.token
      );

      /*
       * Save customer information.
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
       * Remove previous redirect.
       */

      sessionStorage.removeItem(
        "redirectAfterLogin"
      );

      toast.success(
        "Account created successfully!"
      );

      /*
       * Go directly to account.
       */

      router.push("/account");

    } catch (error: any) {
      console.error(
        "Registration Error:",
        error
      );

      console.error(
        "Registration Response:",
        error?.response?.data
      );

      const message =
        error?.response?.data
          ?.message ||
        error?.message ||
        "Registration failed";

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

      {/* CONTENT */}

      <section className="flex items-center justify-center px-6 py-14">

        <div className="w-full max-w-lg">

          {/* BRAND */}

          <div className="mb-8 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10">

              <Sparkles
                size={27}
                className="text-[#D4AF37]"
              />

            </div>

            <p className="mt-5 uppercase tracking-[6px] text-[#D4AF37]">
              MAA FRAGORA
            </p>

            <h1 className="mt-3 text-4xl font-bold">
              Create Account
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Join MAA Fragora and discover
              your signature fragrance.
            </p>

          </div>

          {/* CARD */}

          <div className="rounded-[2rem] border border-white/10 bg-[#111111] p-7 shadow-2xl md:p-9">

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* NAME */}

              <div>

                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Full Name
                </label>

                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(
                      e.target.value
                    )
                  }
                  placeholder="Your full name"
                  autoComplete="name"
                  disabled={loading}
                  className="w-full rounded-xl border border-white/10 bg-[#080808] px-4 py-3.5 text-white outline-none placeholder:text-gray-700 focus:border-[#D4AF37]"
                />

              </div>

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
                  className="w-full rounded-xl border border-white/10 bg-[#080808] px-4 py-3.5 text-white outline-none placeholder:text-gray-700 focus:border-[#D4AF37]"
                />

              </div>

              {/* PHONE */}

              <div>

                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Phone Number
                  <span className="ml-2 text-gray-600">
                    Optional
                  </span>
                </label>

                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) =>
                    setPhone(
                      e.target.value.replace(
                        /\D/g,
                        ""
                      ).slice(0, 10)
                    )
                  }
                  placeholder="10 digit mobile number"
                  autoComplete="tel"
                  disabled={loading}
                  className="w-full rounded-xl border border-white/10 bg-[#080808] px-4 py-3.5 text-white outline-none placeholder:text-gray-700 focus:border-[#D4AF37]"
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
                    placeholder="Minimum 6 characters"
                    autoComplete="new-password"
                    disabled={loading}
                    className="w-full rounded-xl border border-white/10 bg-[#080808] px-4 py-3.5 pr-12 text-white outline-none placeholder:text-gray-700 focus:border-[#D4AF37]"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#D4AF37]"
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

              {/* CONFIRM PASSWORD */}

              <div>

                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Confirm Password
                </label>

                <div className="relative">

                  <input
                    id="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      confirmPassword
                    }
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                    disabled={loading}
                    className="w-full rounded-xl border border-white/10 bg-[#080808] px-4 py-3.5 pr-12 text-white outline-none placeholder:text-gray-700 focus:border-[#D4AF37]"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#D4AF37]"
                  >

                    {showConfirmPassword ? (
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

              {/* REGISTER */}

              <button
                type="submit"
                disabled={loading}
                className="mt-3 flex w-full items-center justify-center gap-3 rounded-full bg-[#D4AF37] py-4 font-bold text-black transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
              >

                <UserPlus
                  size={18}
                />

                {loading
                  ? "Creating Account..."
                  : "Create Account"}

              </button>

            </form>

            {/* LOGIN */}

            <div className="mt-8 border-t border-white/10 pt-7 text-center">

              <p className="text-sm text-gray-500">
                Already have an account?
              </p>

              <Link
                href="/login"
                className="mt-2 inline-block font-semibold text-[#D4AF37] hover:text-white"
              >
                Sign In
              </Link>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}