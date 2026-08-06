"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SocialLogin from "./SocialLogin";

export default function RegisterForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    router.push("/login");
  };

  return (
    <form
      onSubmit={submit}
      className="space-y-6 rounded-3xl border border-white/10 bg-[#111111] p-10"
    >
      <h1 className="text-4xl font-bold text-white">
        Create Account
      </h1>

      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={form.name}
        onChange={handleChange}
        required
        className="w-full rounded-xl bg-[#050505] p-4 text-white outline-none border border-white/10 focus:border-[#D4AF37]"
      />

      <input
        type="email"
        name="email"
        placeholder="Email Address"
        value={form.email}
        onChange={handleChange}
        required
        className="w-full rounded-xl bg-[#050505] p-4 text-white outline-none border border-white/10 focus:border-[#D4AF37]"
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
        className="w-full rounded-xl bg-[#050505] p-4 text-white outline-none border border-white/10 focus:border-[#D4AF37]"
      />

      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        value={form.confirmPassword}
        onChange={handleChange}
        required
        className="w-full rounded-xl bg-[#050505] p-4 text-white outline-none border border-white/10 focus:border-[#D4AF37]"
      />

      <button
        className="w-full rounded-full bg-[#D4AF37] py-4 font-bold text-black transition hover:scale-105"
      >
        Register
      </button>

      <div className="text-center">
        <Link
          href="/login"
          className="text-[#D4AF37]"
        >
          Already have an account?
        </Link>
      </div>

      <SocialLogin />
    </form>
  );
}