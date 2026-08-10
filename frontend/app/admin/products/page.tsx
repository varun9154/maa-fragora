"use client";

import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import toast from "react-hot-toast";

import ProductTable from "@/components/admin/ProductTable";
import ProductFormModal, {
  ProductFormData,
} from "@/components/admin/ProductFormModal";

import useAdminProducts from "@/hooks/useAdminProducts";

import {
  createProduct,
  updateProduct,
} from "@/services/adminProductService";

export default function ProductsPage() {
  const { productsQuery, deleteMutation } =
    useAdminProducts();

  const [search, setSearch] = useState("");

  const [openModal, setOpenModal] =
    useState(false);

  const [editingProduct, setEditingProduct] =
    useState<any>(null);

  const products = useMemo(() => {
    const data =
      productsQuery.data?.products || [];

    return data.filter((product: any) =>
      product.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [productsQuery.data, search]);

  const handleDelete = (id: string) => {
    if (!confirm("Delete Product?")) return;

    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Product Deleted");
      },
      onError: () => {
        toast.error("Delete Failed");
      },
    });
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setOpenModal(true);
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setOpenModal(true);
  };

  const handleSubmit = async (
    data: ProductFormData
  ) => {
    try {
      if (editingProduct) {
        await updateProduct(
          editingProduct._id,
          data
        );

        toast.success(
          "Product Updated Successfully"
        );
      } else {
        await createProduct(data);

        toast.success(
          "Product Created Successfully"
        );
      }

      setOpenModal(false);

      productsQuery.refetch();

    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  if (productsQuery.isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">

        Loading...

      </div>
    );
  }

  return (
    <div>

      <div className="mb-10 flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-bold">

            Products

          </h1>

          <p className="text-gray-400">

            Manage Products

          </p>

        </div>

        <button
          onClick={handleCreate}
          className="flex items-center gap-2 rounded-full bg-[#D4AF37] px-6 py-3 font-semibold text-black"
        >

          <Plus size={18} />

          Add Product

        </button>

      </div>

      <div className="relative mb-8 max-w-md">

        <Search
          className="absolute left-4 top-4"
          size={18}
        />

        <input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search..."
          className="w-full rounded-full border border-white/10 bg-[#111111] py-3 pl-12"
        />

      </div>

      <ProductTable
        products={products}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

      <ProductFormModal
        open={openModal}
        onClose={() =>
          setOpenModal(false)
        }
        initialData={editingProduct}
        onSubmit={handleSubmit}
      />

    </div>
  );
}