import ProductCard from "./ProductCard";
import { products } from "@/data/products";

export default function ProductGrid() {
  return (
    <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          slug={product.slug}
          name={product.name}
          category={product.category}
          description={product.description}
          image={product.image}
          price={product.price}
          oldPrice={product.oldPrice}
          rating={product.rating}
          reviews={product.reviews}
        />
      ))}
    </div>
  );
}