"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import ImageUploader from "./ImageUploader";

export interface ProductFormData {
  name: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  featured: boolean;
  image: string;
}

interface ProductFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => void;
  initialData?: Partial<ProductFormData>;
  loading?: boolean;
}

export default function ProductFormModal({
  open,
  onClose,
  onSubmit,
  initialData,
  loading = false,
}: ProductFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
  } = useForm<ProductFormData>({
    defaultValues: {
      name: "",
      category: "",
      description: "",
      price: 0,
      stock: 0,
      featured: false,
      image: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || "",
        category: initialData.category || "",
        description: initialData.description || "",
        price: initialData.price || 0,
        stock: initialData.stock || 0,
        featured: initialData.featured || false,
        image: initialData.image || "",
      });
    } else {
      reset({
        name: "",
        category: "",
        description: "",
        price: 0,
        stock: 0,
        featured: false,
        image: "",
      });
    }
  }, [initialData, reset]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">

      <div className="w-full max-w-3xl rounded-3xl bg-[#111111] p-8 shadow-2xl">

        <div className="mb-8 flex items-center justify-between">

          <h2 className="text-3xl font-bold text-white">
            {initialData ? "Edit Product" : "Add Product"}
          </h2>

          <button
            onClick={onClose}
            className="text-3xl text-gray-400 transition hover:text-white"
          >
            ×
          </button>

        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >

          {/* Product Image */}

          <div>

            <label className="mb-3 block text-sm font-medium text-gray-300">
              Product Image
            </label>

            <ImageUploader
              value={watch("image")}
              onChange={(url) =>
                setValue("image", url)
              }
            />

          </div>

          {/* Product Name */}

          <div>

            <label className="mb-2 block text-sm text-gray-300">
              Product Name
            </label>

            <input
              {...register("name", {
                required: true,
              })}
              placeholder="Luxury Perfume Name"
              className="w-full rounded-xl border border-white/10 bg-[#181818] p-4 text-white outline-none transition focus:border-[#D4AF37]"
            />

          </div>

          {/* Category */}

          <div>

            <label className="mb-2 block text-sm text-gray-300">
              Category
            </label>

            <input
              {...register("category", {
                required: true,
              })}
              placeholder="Luxury / Oud / Floral"
              className="w-full rounded-xl border border-white/10 bg-[#181818] p-4 text-white outline-none transition focus:border-[#D4AF37]"
            />

          </div>

          {/* Description */}

          <div>

            <label className="mb-2 block text-sm text-gray-300">
              Description
            </label>

            <textarea
              {...register("description")}
              rows={5}
              placeholder="Write product description..."
              className="w-full rounded-xl border border-white/10 bg-[#181818] p-4 text-white outline-none transition focus:border-[#D4AF37]"
            />

          </div>

          {/* Price & Stock */}

          <div className="grid gap-5 md:grid-cols-2">

            <div>

              <label className="mb-2 block text-sm text-gray-300">
                Price
              </label>

              <input
                type="number"
                {...register("price", {
                  valueAsNumber: true,
                })}
                className="w-full rounded-xl border border-white/10 bg-[#181818] p-4 text-white outline-none transition focus:border-[#D4AF37]"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm text-gray-300">
                Stock
              </label>

              <input
                type="number"
                {...register("stock", {
                  valueAsNumber: true,
                })}
                className="w-full rounded-xl border border-white/10 bg-[#181818] p-4 text-white outline-none transition focus:border-[#D4AF37]"
              />

            </div>

          </div>

          {/* Featured */}

          <div className="flex items-center gap-3">

            <input
              type="checkbox"
              {...register("featured")}
              className="h-5 w-5 accent-[#D4AF37]"
            />

            <span className="text-white">
              Featured Product
            </span>

          </div>

          {/* Buttons */}

          <div className="flex justify-end gap-4 pt-6">

            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-gray-600 px-6 py-3 text-white transition hover:border-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-[#D4AF37] px-8 py-3 font-semibold text-black transition hover:scale-105 disabled:opacity-60"
            >
              {loading
                ? "Saving..."
                : initialData
                ? "Update Product"
                : "Create Product"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}