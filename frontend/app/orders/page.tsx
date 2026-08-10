"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import useOrder from "@/hooks/useOrders";

export default function OrdersPage() {

  const { ordersQuery } = useOrder();

  if (ordersQuery.isLoading) {

    return (
      <>
        <Navbar />

        <main className="flex min-h-screen items-center justify-center bg-[#050505] text-white">

          Loading Orders...

        </main>

        <Footer />
      </>
    );

  }

  const orders =
    ordersQuery.data?.orders ?? [];

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#050505] text-white">

        <section className="mx-auto max-w-6xl px-6 py-20">

          <h1 className="mb-12 text-5xl font-bold">

            My Orders

          </h1>

          {orders.length === 0 && (

            <div className="rounded-3xl border border-white/10 bg-[#111] p-10 text-center">

              <h2 className="text-2xl">

                No Orders Yet

              </h2>

            </div>

          )}

          <div className="space-y-8">

            {orders.map((order: any) => (

              <div
                key={order._id}
                className="rounded-3xl border border-white/10 bg-[#111] p-8"
              >

                <div className="flex flex-col justify-between gap-4 md:flex-row">

                  <div>

                    <h2 className="text-2xl font-bold">

                      Order #{order._id.slice(-6)}

                    </h2>

                    <p className="mt-2 text-gray-400">

                      {new Date(order.createdAt).toLocaleDateString()}

                    </p>

                  </div>

                  <div className="text-right">

                    <p className="font-semibold text-[#D4AF37]">

                      ₹{order.totalAmount}

                    </p>

                    <p className="mt-2 text-green-400">

                      {order.orderStatus}

                    </p>

                  </div>

                </div>

                <div className="mt-8 space-y-3">

                  {order.items.map((item: any) => (

                    <div
                      key={item.productId}
                      className="flex justify-between border-b border-white/10 pb-3"
                    >

                      <span>

                        {item.name}

                      </span>

                      <span>

                        x{item.quantity}

                      </span>

                    </div>

                  ))}

                </div>

              </div>

            ))}

          </div>

        </section>

      </main>

      <Footer />

    </>
  );
}