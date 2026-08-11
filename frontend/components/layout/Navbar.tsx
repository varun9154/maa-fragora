"use client";

import {
  Search,
  Heart,
  User,
  ShoppingBag,
  Menu,
  X,
} from "lucide-react";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useCartStore } from "@/store/cartStore";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const cart =
    useCartStore((state) => state.cart) ?? [];

  const [isLoggedIn, setIsLoggedIn] =
    useState(false);

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [mounted, setMounted] =
    useState(false);

  /*
  |--------------------------------------------------------------------------
  | Check authentication
  |--------------------------------------------------------------------------
  */

  const checkAuth = () => {
    if (typeof window === "undefined") {
      return;
    }

    const token =
      localStorage.getItem("token");

    setIsLoggedIn(
      Boolean(token)
    );
  };

  useEffect(() => {
    setMounted(true);

    checkAuth();

    /*
     * Re-check when user returns to
     * this browser tab.
     */

    const handleFocus = () => {
      checkAuth();
    };

    window.addEventListener(
      "focus",
      handleFocus
    );

    return () => {
      window.removeEventListener(
        "focus",
        handleFocus
      );
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Navigation
  |--------------------------------------------------------------------------
  */

  const navItems = [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "Shop",
      href: "/shop",
    },
    {
      name: "Collections",
      href: "/collections",
    },
    {
      name: "About",
      href: "/about",
    },
    {
      name: "Contact",
      href: "/contact",
    },
  ];

  /*
  |--------------------------------------------------------------------------
  | Account
  |--------------------------------------------------------------------------
  */

  const handleAccount = () => {
    if (!mounted) {
      return;
    }

    const token =
      localStorage.getItem("token");

    if (token) {
      router.push("/account");
    } else {
      router.push(
        "/login?redirect=/account"
      );
    }

    setMobileOpen(false);
  };

  /*
  |--------------------------------------------------------------------------
  | Cart
  |--------------------------------------------------------------------------
  */

  const handleCart = () => {
    if (!mounted) {
      return;
    }

    const token =
      localStorage.getItem("token");

    if (token) {
      router.push("/cart");
    } else {
      router.push(
        "/login?redirect=/cart"
      );
    }

    setMobileOpen(false);
  };

  /*
  |--------------------------------------------------------------------------
  | Wishlist
  |--------------------------------------------------------------------------
  */

  const handleWishlist = () => {
    if (!mounted) {
      return;
    }

    const token =
      localStorage.getItem("token");

    if (token) {
      router.push("/wishlist");
    } else {
      router.push(
        "/login?redirect=/wishlist"
      );
    }

    setMobileOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-[100] border-b border-white/10 bg-[#050505]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1500px] items-center justify-between px-5 sm:px-8 lg:px-12">
          {/* =================================================
              LOGO
          ================================================= */}

          <Link
            href="/"
            className="group flex items-center"
          >
            <div>
              <div className="text-xl font-bold tracking-[4px] text-white transition group-hover:text-[#D4AF37] sm:text-2xl">
                MAA FRAGORA
              </div>

              <div className="hidden text-[8px] tracking-[4px] text-gray-500 sm:block">
                LUXURY WITHIN REACH
              </div>
            </div>
          </Link>

          {/* =================================================
              DESKTOP NAV
          ================================================= */}

          <nav className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => {
              const active =
                pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative py-2 text-[15px] font-medium transition ${
                    active
                      ? "text-[#D4AF37]"
                      : "text-gray-300 hover:text-[#D4AF37]"
                  }`}
                >
                  {item.name}

                  {active && (
                    <span className="absolute -bottom-1 left-0 right-0 mx-auto h-[2px] w-5 rounded-full bg-[#D4AF37]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* =================================================
              DESKTOP ACTIONS
          ================================================= */}

          <div className="hidden items-center gap-5 lg:flex">
            {/* Search */}

            <button
              type="button"
              aria-label="Search"
              onClick={() =>
                router.push("/shop")
              }
              className="text-gray-300 transition hover:scale-110 hover:text-[#D4AF37]"
            >
              <Search
                size={22}
                strokeWidth={1.8}
              />
            </button>

            {/* Wishlist */}

            <button
              type="button"
              aria-label="Wishlist"
              onClick={
                handleWishlist
              }
              className="text-gray-300 transition hover:scale-110 hover:text-[#D4AF37]"
            >
              <Heart
                size={22}
                strokeWidth={1.8}
              />
            </button>

            {/* Account */}

            <button
              type="button"
              aria-label="Account"
              onClick={
                handleAccount
              }
              className={`transition hover:scale-110 hover:text-[#D4AF37] ${
                isLoggedIn
                  ? "text-[#D4AF37]"
                  : "text-gray-300"
              }`}
            >
              <User
                size={23}
                strokeWidth={1.8}
              />
            </button>

            {/* Cart */}

            <button
              type="button"
              aria-label="Shopping cart"
              onClick={
                handleCart
              }
              className="relative text-gray-300 transition hover:scale-110 hover:text-[#D4AF37]"
            >
              <ShoppingBag
                size={23}
                strokeWidth={1.8}
              />

              {cart.length > 0 && (
                <span className="absolute -right-3 -top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#D4AF37] px-1 text-[10px] font-bold text-black">
                  {cart.length}
                </span>
              )}
            </button>
          </div>

          {/* =================================================
              MOBILE BUTTON
          ================================================= */}

          <button
            type="button"
            onClick={() =>
              setMobileOpen(
                (previous) =>
                  !previous
              )
            }
            className="text-gray-300 lg:hidden"
            aria-label="Open menu"
          >
            {mobileOpen ? (
              <X size={26} />
            ) : (
              <Menu size={26} />
            )}
          </button>
        </div>

        {/* ===================================================
            MOBILE MENU
        =================================================== */}

        {mobileOpen && (
          <div className="border-t border-white/10 bg-[#080808] px-5 py-6 lg:hidden">
            <nav className="flex flex-col">
              {navItems.map(
                (item) => {
                  const active =
                    pathname ===
                    item.href;

                  return (
                    <Link
                      key={
                        item.href
                      }
                      href={
                        item.href
                      }
                      onClick={() =>
                        setMobileOpen(
                          false
                        )
                      }
                      className={`border-b border-white/5 py-4 text-base ${
                        active
                          ? "text-[#D4AF37]"
                          : "text-gray-300"
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                }
              )}

              <div className="mt-5 flex items-center justify-around border-t border-white/10 pt-6">
                <button
                  onClick={
                    handleWishlist
                  }
                  className="flex flex-col items-center gap-2 text-gray-300"
                >
                  <Heart size={21} />
                  <span className="text-xs">
                    Wishlist
                  </span>
                </button>

                <button
                  onClick={
                    handleAccount
                  }
                  className="flex flex-col items-center gap-2 text-gray-300"
                >
                  <User size={21} />
                  <span className="text-xs">
                    Account
                  </span>
                </button>

                <button
                  onClick={
                    handleCart
                  }
                  className="relative flex flex-col items-center gap-2 text-gray-300"
                >
                  <ShoppingBag
                    size={21}
                  />

                  {cart.length >
                    0 && (
                    <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#D4AF37] text-[10px] font-bold text-black">
                      {
                        cart.length
                      }
                    </span>
                  )}

                  <span className="text-xs">
                    Cart
                  </span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}