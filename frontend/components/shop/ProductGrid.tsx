"use client";

import { useEffect, useState } from "react";

import ProductCard from "./ProductCard";

import { getProducts } from "@/services/productService";

import { Product } from "@/types/product";

interface ProductGridProps {
  search?: string;
  category?: string;
}

export default function ProductGrid({
  search = "",
  category = "All",
}: ProductGridProps) {

  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {

    async function loadProducts() {

      try {

        setLoading(true);

        const response = await getProducts();

        setProducts(response.products);

      } catch (err) {

        console.error(err);

        setError("Unable to load products.");

      } finally {

        setLoading(false);

      }

    }

    loadProducts();

  }, []);

  const filteredProducts = products.filter((product) => {

    const matchesSearch =
      product.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      product.description
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" ||

      product.category === category;

    return matchesSearch && matchesCategory;

  });

  if (loading) {

    return (

      <div className="flex h-96 items-center justify-center">

        <h2 className="text-2xl text-[#D4AF37] animate-pulse">

          Loading Products...

        </h2>

      </div>

    );

  }

  if (error) {

    return (

      <div className="flex h-96 items-center justify-center">

        <h2 className="text-red-500 text-2xl">

          {error}

        </h2>

      </div>

    );

  }

  if (filteredProducts.length === 0) {

    return (

      <div className="flex h-96 items-center justify-center">

        <h2 className="text-2xl text-gray-400">

          No Products Found

        </h2>

      </div>

    );

  }

  return (

    <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">

      {filteredProducts.map((product) => (

        <ProductCard

          key={product._id}

          id={product._id}

          slug={product.slug}

          name={product.name}

          category={product.category}

          description={product.description}

          images={product.images}

          price={product.price}

          oldPrice={product.oldPrice ?? product.price}

          rating={product.rating}

          reviews={product.reviews}

          stock={product.stock}

        />

      ))}

    </div>

  );

}