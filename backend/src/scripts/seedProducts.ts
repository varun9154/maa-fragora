import mongoose from "mongoose";
import dotenv from "dotenv";

import Product from "../models/Product";

dotenv.config();

const products = [
  {
    name: "Noir Crown",
    slug: "noir-crown",
    category: "Signature",
    description: "Premium woody fragrance with rich notes.",
    shortDescription: "Luxury woody perfume",
    images: ["/images/products/noir-crown.png"],
    price: 999,
    oldPrice: 1499,
    stock: 50,
    featured: true,
    rating: 4.9,
    reviews: 234,
    sku: "MF001",
    brand: "MAA Fragora",
    volume: "100ml",
    gender: "Men",
    notes: {
      top: ["Bergamot", "Lemon"],
      middle: ["Lavender", "Jasmine"],
      base: ["Oud", "Musk", "Amber"]
    }
  },
  {
    name: "Golden Ember",
    slug: "golden-ember",
    category: "Luxury",
    description: "Warm amber fragrance.",
    shortDescription: "Amber Luxury",
    images: ["/images/products/golden-ember.png"],
    price: 1199,
    oldPrice: 1699,
    stock: 35,
    featured: true,
    rating: 5,
    reviews: 180,
    sku: "MF002",
    brand: "MAA Fragora",
    volume: "100ml",
    gender: "Unisex",
    notes: {
      top: ["Orange"],
      middle: ["Rose"],
      base: ["Amber", "Vanilla"]
    }
  },
  {
    name: "Velvet Bloom",
    slug: "velvet-bloom",
    category: "Fresh",
    description: "Soft floral fragrance.",
    shortDescription: "Fresh Floral",
    images: ["/images/products/velvet-bloom.png"],
    price: 899,
    oldPrice: 1399,
    stock: 40,
    featured: true,
    rating: 4.8,
    reviews: 121,
    sku: "MF003",
    brand: "MAA Fragora",
    volume: "100ml",
    gender: "Women",
    notes: {
      top: ["Pear"],
      middle: ["Rose"],
      base: ["Musk"]
    }
  },
  {
    name: "Ocean Veil",
    slug: "ocean-veil",
    category: "Fresh",
    description: "Aquatic citrus fragrance.",
    shortDescription: "Ocean Fresh",
    images: ["/images/products/ocean-veil.png"],
    price: 799,
    oldPrice: 1299,
    stock: 30,
    featured: false,
    rating: 4.7,
    reviews: 88,
    sku: "MF004",
    brand: "MAA Fragora",
    volume: "100ml",
    gender: "Unisex",
    notes: {
      top: ["Lemon"],
      middle: ["Sea Notes"],
      base: ["Musk"]
    }
  },
  {
    name: "Imperial Oud",
    slug: "imperial-oud",
    category: "Oud",
    description: "Royal Oud fragrance.",
    shortDescription: "Premium Oud",
    images: ["/images/products/imperial-oud.png"],
    price: 1499,
    oldPrice: 1999,
    stock: 15,
    featured: true,
    rating: 5,
    reviews: 65,
    sku: "MF005",
    brand: "MAA Fragora",
    volume: "100ml",
    gender: "Men",
    notes: {
      top: ["Saffron"],
      middle: ["Rose"],
      base: ["Oud", "Leather"]
    }
  },
  {
    name: "Midnight Aura",
    slug: "midnight-aura",
    category: "Limited",
    description: "Dark spicy fragrance.",
    shortDescription: "Limited Edition",
    images: ["/images/products/midnight-aura.png"],
    price: 1399,
    oldPrice: 1899,
    stock: 20,
    featured: true,
    rating: 4.9,
    reviews: 72,
    sku: "MF006",
    brand: "MAA Fragora",
    volume: "100ml",
    gender: "Unisex",
    notes: {
      top: ["Black Pepper"],
      middle: ["Patchouli"],
      base: ["Amber", "Musk"]
    }
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);

    console.log("✅ MongoDB Connected");

    await Product.deleteMany();

    console.log("🗑 Old Products Removed");

    await Product.insertMany(products);

    console.log("🎉 Products Seeded Successfully");

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seedDatabase();