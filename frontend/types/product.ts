export interface Product {
  id: number;
  slug: string;

  name: string;

  category: string;

  description: string;

  image: string;

  price: number;

  oldPrice: number;

  rating: number;

  reviews: number;

  stock: number;

  featured: boolean;
}