export interface StoreProduct {
  id: number;
  slug: string;
  name: string;
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
  gender: string;

  notes: {
    top: string[];
    middle: string[];
    base: string[];
  };
}

export const products: StoreProduct[] = [
  {
    id: 1,

    slug: "noir-crown",

    name: "Noir Crown",

    category: "Signature",

    description:
      "A powerful dark fragrance with rich woody and oriental notes.",

    shortDescription:
      "Bold, dark and sophisticated.",

    images: [
      "/images/products/noir-crown.png",
    ],

    price: 999,

    oldPrice: 1499,

    stock: 50,

    featured: true,

    rating: 4.9,

    reviews: 234,

    sku: "MF-NC-001",

    brand: "MAA FRAGORA",

    volume: "100ml",

    gender: "Unisex",

    notes: {
      top: [
        "Bergamot",
        "Black Pepper",
      ],

      middle: [
        "Rose",
        "Jasmine",
      ],

      base: [
        "Oud",
        "Musk",
        "Amber",
      ],
    },
  },

  {
    id: 2,

    slug: "golden-ember",

    name: "Golden Ember",

    category: "Luxury",

    description:
      "A warm and luxurious fragrance combining amber, spice and woods.",

    shortDescription:
      "Warm, elegant and luxurious.",

    images: [
      "/images/products/golden-ember.png",
    ],

    price: 1199,

    oldPrice: 1699,

    stock: 35,

    featured: true,

    rating: 5,

    reviews: 180,

    sku: "MF-GE-002",

    brand: "MAA FRAGORA",

    volume: "100ml",

    gender: "Unisex",

    notes: {
      top: [
        "Saffron",
        "Citrus",
      ],

      middle: [
        "Amber",
        "Jasmine",
      ],

      base: [
        "Oud",
        "Vanilla",
        "Musk",
      ],
    },
  },

  {
    id: 3,

    slug: "velvet-bloom",

    name: "Velvet Bloom",

    category: "Fresh",

    description:
      "A soft floral fragrance with elegant fruity and creamy notes.",

    shortDescription:
      "Soft, floral and graceful.",

    images: [
      "/images/products/velvet-bloom.png",
    ],

    price: 899,

    oldPrice: 1399,

    stock: 40,

    featured: true,

    rating: 4.8,

    reviews: 121,

    sku: "MF-VB-003",

    brand: "MAA FRAGORA",

    volume: "100ml",

    gender: "Women",

    notes: {
      top: [
        "Pear",
        "Bergamot",
      ],

      middle: [
        "Rose",
        "Peony",
      ],

      base: [
        "Musk",
        "Vanilla",
      ],
    },
  },

  {
    id: 4,

    slug: "ocean-veil",

    name: "Ocean Veil",

    category: "Fresh",

    description:
      "A fresh aquatic fragrance designed for a clean and energetic impression.",

    shortDescription:
      "Fresh, aquatic and energetic.",

    images: [
      "/images/products/ocean-veil.png",
    ],

    price: 799,

    oldPrice: 1299,

    stock: 30,

    featured: false,

    rating: 4.7,

    reviews: 88,

    sku: "MF-OV-004",

    brand: "MAA FRAGORA",

    volume: "100ml",

    gender: "Men",

    notes: {
      top: [
        "Lemon",
        "Marine Notes",
      ],

      middle: [
        "Lavender",
        "Geranium",
      ],

      base: [
        "Cedarwood",
        "Musk",
      ],
    },
  },

  {
    id: 5,

    slug: "imperial-oud",

    name: "Imperial Oud",

    category: "Oud",

    description:
      "A rich oud fragrance with deep woody, smoky and amber accords.",

    shortDescription:
      "Rich, smoky and regal.",

    images: [
      "/images/products/imperial-oud.png",
    ],

    price: 1499,

    oldPrice: 1999,

    stock: 15,

    featured: true,

    rating: 5,

    reviews: 65,

    sku: "MF-IO-005",

    brand: "MAA FRAGORA",

    volume: "100ml",

    gender: "Unisex",

    notes: {
      top: [
        "Saffron",
        "Cardamom",
      ],

      middle: [
        "Oud",
        "Rose",
      ],

      base: [
        "Agarwood",
        "Amber",
      ],
    },
  },

  {
    id: 6,

    slug: "midnight-aura",

    name: "Midnight Aura",

    category: "Limited",

    description:
      "A mysterious floral fragrance with a smooth and sensual finish.",

    shortDescription:
      "Mysterious, sensual and elegant.",

    images: [
      "/images/products/midnight-aura.png",
    ],

    price: 1399,

    oldPrice: 1899,

    stock: 20,

    featured: true,

    rating: 4.9,

    reviews: 72,

    sku: "MF-MA-006",

    brand: "MAA FRAGORA",

    volume: "100ml",

    gender: "Unisex",

    notes: {
      top: [
        "Blackcurrant",
        "Bergamot",
      ],

      middle: [
        "Iris",
        "Jasmine",
        "Rose",
      ],

      base: [
        "Musk",
        "Vanilla",
        "Patchouli",
      ],
    },
  },
];