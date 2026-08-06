import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductGallery from "@/components/product/ProductGallery";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

async function getProduct(slug: string) {
  try {
    const response = await fetch(
      `http://localhost:5000/api/products/${slug}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    return data.product;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function ProductPage({
  params,
}: PageProps) {

  const { slug } = await params;

  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#050505] text-white">

        <section className="mx-auto max-w-7xl px-6 py-20">

          <div className="grid gap-16 lg:grid-cols-2">

            <ProductGallery
              images={product.images}
              name={product.name}
            />

            <div>

              <p className="uppercase tracking-[5px] text-[#D4AF37]">
                {product.category}
              </p>

              <h1 className="mt-4 text-5xl font-bold">
                {product.name}
              </h1>

              <div className="mt-6 flex items-center gap-4">

                <span className="rounded-full bg-[#D4AF37] px-4 py-1 font-semibold text-black">
                  ⭐ {product.rating}
                </span>

                <span className="text-gray-400">
                  {product.reviews} Reviews
                </span>

              </div>

              <p className="mt-8 leading-8 text-gray-300">
                {product.description}
              </p>

              <div className="mt-10 flex items-center gap-5">

                <span className="text-5xl font-bold text-[#D4AF37]">
                  ₹{product.price}
                </span>

                {product.oldPrice && (

                  <span className="text-2xl text-gray-500 line-through">

                    ₹{product.oldPrice}

                  </span>

                )}

              </div>

              <div className="mt-12 rounded-3xl border border-white/10 bg-[#111111] p-8">

                <h2 className="text-2xl font-semibold">

                  Product Details

                </h2>

                <div className="mt-6 space-y-5">

                  <div className="flex justify-between">

                    <span className="text-gray-400">

                      Category

                    </span>

                    <span>

                      {product.category}

                    </span>

                  </div>

                  <div className="flex justify-between">

                    <span className="text-gray-400">

                      Rating

                    </span>

                    <span>

                      {product.rating}/5

                    </span>

                  </div>

                  <div className="flex justify-between">

                    <span className="text-gray-400">

                      Reviews

                    </span>

                    <span>

                      {product.reviews}

                    </span>

                  </div>

                  <div className="flex justify-between">

                    <span className="text-gray-400">

                      Availability

                    </span>

                    <span
                      className={
                        product.stock > 0
                          ? "text-green-400"
                          : "text-red-500"
                      }
                    >
                      {product.stock > 0
                        ? `${product.stock} In Stock`
                        : "Out of Stock"}
                    </span>

                  </div>

                </div>

              </div>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">

                <button className="flex-1 rounded-full bg-[#D4AF37] py-4 text-lg font-semibold text-black transition hover:scale-105">

                  Add To Cart

                </button>

                <button className="flex-1 rounded-full border border-[#D4AF37] py-4 text-lg font-semibold text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-black">

                  Buy Now

                </button>

              </div>

              <div className="mt-8">

                <Link
                  href="/shop"
                  className="text-[#D4AF37] hover:underline"
                >
                  ← Back to Shop
                </Link>

              </div>

            </div>

          </div>

        </section>

      </main>

      <Footer />

    </>
  );
}