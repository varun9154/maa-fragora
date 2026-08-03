import {
  Truck,
  ShieldCheck,
  Sparkles,
  BadgeCheck,
} from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Fast & secure delivery across India.",
  },
  {
    icon: Sparkles,
    title: "Premium Quality",
    description: "Luxury inspired fragrances made with care.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    description: "100% safe and trusted payment gateway.",
  },
  {
    icon: BadgeCheck,
    title: "Trusted Brand",
    description: "Quality, elegance and customer satisfaction.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-[#0f0f0f] py-28">

      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-16 text-center">

          <p className="tracking-[8px] text-[#D4AF37] uppercase">
            WHY CHOOSE US
          </p>

          <h2 className="mt-4 text-5xl font-bold">
            Experience The Difference
          </h2>

        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {features.map((item) => {

            const Icon = item.icon;

            return (

              <div
                key={item.title}
                className="rounded-3xl border border-white/10 bg-[#151515] p-8 text-center transition duration-500 hover:border-[#D4AF37] hover:-translate-y-3"
              >

                <div className="mb-6 flex justify-center">

                  <Icon
                    className="text-[#D4AF37]"
                    size={42}
                  />

                </div>

                <h3 className="text-2xl font-semibold">
                  {item.title}
                </h3>

                <p className="mt-4 text-gray-400">
                  {item.description}
                </p>

              </div>

            );

          })}

        </div>

      </div>

    </section>
  );
}