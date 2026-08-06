export interface Product {
  _id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  shortDescription: string;
  images: string[];
  price: number;
  oldPrice?: number;
  stock: number;
  featured: boolean;
  rating: number;
  reviews: number;
  sku: string;
  brand: string;
  volume: string;
  gender: "Men" | "Women" | "Unisex";
}