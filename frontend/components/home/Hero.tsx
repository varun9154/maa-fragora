"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-[#090909]">

      {/* Background */}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#2b2b2b,transparent_65%)] opacity-60" />

      <div className="absolute left-1/2 top-0 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-[#D4AF37]/5 blur-[180px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 py-24 lg:grid-cols-2">

        {/* Left Content */}

        <motion.div
          initial={{
            opacity: 0,
            x: -60,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 1,
          }}
          className="z-10 flex flex-col justify-center"
        >

          <p className="mb-4 tracking-[8px] text-[#D4AF37]">
            LUXURY FRAGRANCES
          </p>

          <h1 className="text-6xl font-bold leading-tight lg:text-8xl">

            Experience

            <span className="block text-[#D4AF37]">
              Luxury
            </span>

            Everyday

          </h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-gray-400">
            Premium inspired perfumes crafted for confidence,
            elegance and unforgettable impressions.
          </p>

          <div className="mt-10 flex gap-5">

            <Button>
              Shop Now
            </Button>

            <Button variant="outline">
              Explore
            </Button>

          </div>

        </motion.div>

        {/* Right Image */}

        <motion.div
          initial={{
            opacity: 0,
            x: 80,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 1,
          }}
          className="relative flex items-center justify-center"
        >

          {/* Golden Glow */}

          <div className="absolute h-[520px] w-[520px] rounded-full bg-[#D4AF37]/15 blur-[120px]" />

          {/* Rotating Ring */}

          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute h-[420px] w-[420px] rounded-full border border-[#D4AF37]/20"
          />

          {/* Bottle */}

          <motion.div
            animate={{
              y: [-15, 15, -15],
              rotate: [-2, 2, -2],
            }}
            transition={{
              repeat: Infinity,
              duration: 5,
              ease: "easeInOut",
            }}
            whileHover={{
              scale: 1.08,
              rotate: 4,
            }}
            className="relative z-20"
          >

            <Image
              src="/images/hero/luxury-perfume.png"
              alt="Luxury Perfume"
              width={420}
              height={650}
              priority
              className="drop-shadow-[0_35px_90px_rgba(212,175,55,.55)]"
            />

          </motion.div>

          {/* Sparkle */}

          <motion.div
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.6, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="absolute left-5 top-16 h-4 w-4 rounded-full bg-[#D4AF37]"
          />

          <motion.div
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.4, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
            className="absolute bottom-16 right-12 h-3 w-3 rounded-full bg-yellow-300"
          />

          <motion.div
            animate={{
              opacity: [0.2, 1, 0.2],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
            }}
            className="absolute top-1/2 left-0 h-2 w-2 rounded-full bg-white"
          />

          <motion.div
            animate={{
              opacity: [0.2, 1, 0.2],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
            }}
            className="absolute right-0 top-1/3 h-2 w-2 rounded-full bg-[#D4AF37]"
          />

        </motion.div>

      </div>

    </section>
  );
}