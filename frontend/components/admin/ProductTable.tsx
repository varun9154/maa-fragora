"use client";

import Image from "next/image";
import {
  Pencil,
  Trash2,
  Star,
} from "lucide-react";

interface Product {
  id?: number | string;
  _id?: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  featured: boolean;
  images: string[];
}

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export default function ProductTable({
  products,
  onEdit,
  onDelete,
}: ProductTableProps) {
  if (!products.length) {
    return (
      <div className="rounded-3xl border border-white/10 bg-[#111111] p-12 text-center">

        <h2 className="text-2xl font-semibold">
          No Products Found
        </h2>

      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#111111]">

      <table className="w-full">

        <thead className="bg-[#181818]">

          <tr>

            <th className="px-6 py-5 text-left">
              Image
            </th>

            <th className="px-6 py-5 text-left">
              Name
            </th>

            <th className="px-6 py-5 text-left">
              Category
            </th>

            <th className="px-6 py-5 text-left">
              Price
            </th>

            <th className="px-6 py-5 text-left">
              Stock
            </th>

            <th className="px-6 py-5 text-left">
              Featured
            </th>

            <th className="px-6 py-5 text-center">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {products.map((product) => (

            <tr
              key={String(product.id || product._id)}
              className="border-t border-white/10 hover:bg-[#1a1a1a]"
            >

              <td className="px-6 py-5">

                <div className="relative h-16 w-16 overflow-hidden rounded-xl">

                  <Image
                    src={product.images?.[0] || "/placeholder.png"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />

                </div>

              </td>

              <td className="px-6 py-5 font-semibold">

                {product.name}

              </td>

              <td className="px-6 py-5">

                {product.category}

              </td>

              <td className="px-6 py-5 text-[#D4AF37]">

                ₹{product.price}

              </td>

              <td className="px-6 py-5">

                {product.stock}

              </td>

              <td className="px-6 py-5">

                {product.featured ? (

                  <Star
                    fill="currentColor"
                    className="text-[#D4AF37]"
                  />

                ) : (

                  "-"

                )}

              </td>

              <td className="px-6 py-5">

                <div className="flex justify-center gap-3">

                  <button
                    onClick={() => onEdit(product)}
                    className="rounded-xl bg-blue-600 p-2 transition hover:bg-blue-700"
                  >

                    <Pencil size={18} />

                  </button>

                  <button
                    onClick={() =>
                      onDelete(String(product.id || product._id))
                    }
                    className="rounded-xl bg-red-600 p-2 transition hover:bg-red-700"
                  >

                    <Trash2 size={18} />

                  </button>

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}