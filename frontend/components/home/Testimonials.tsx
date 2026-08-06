import { Star } from "lucide-react";

const reviews = [
  {
    name: "Rahul Sharma",
    city: "Bangalore",
    review:
      "Amazing fragrance and long lasting. Worth every rupee.",
  },
  {
    name: "Priya Reddy",
    city: "Hyderabad",
    review:
      "Luxury quality perfume at an affordable price.",
  },
  {
    name: "Akash Verma",
    city: "Delhi",
    review:
      "Beautiful packaging and premium fragrance collection.",
  },
];

export default function Testimonials() {
  return (
    <section className="py-28">

      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-16 text-center">

          <p className="tracking-[8px] uppercase text-[#D4AF37]">
            TESTIMONIALS
          </p>

          <h2 className="mt-4 text-5xl font-bold">
            What Customers Say
          </h2>

        </div>

        <div className="grid gap-8 lg:grid-cols-3">

          {reviews.map((item) => (

            <div
              key={item.name}
              className="rounded-3xl border border-white/10 bg-[#151515] p-8 transition duration-500 hover:border-[#D4AF37]"
            >

              <div className="mb-5 flex text-[#D4AF37]">

                {[1,2,3,4,5].map((i)=>(
                  <Star
                    key={i}
                    fill="currentColor"
                    size={18}
                  />
                ))}

              </div>

              <p className="text-gray-400">
  &ldquo;{item.review}&rdquo;
</p>

              <div className="mt-8">

                <h3 className="text-xl font-semibold">
                  {item.name}
                </h3>

                <p className="text-gray-500">
                  {item.city}
                </p>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}