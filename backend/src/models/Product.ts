import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
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

  notes: {
    top: string[];
    middle: string[];
    base: string[];
  };
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },

    category: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    shortDescription: {
      type: String,
      default: "",
    },

    images: {
      type: [String],
      default: [],
    },

    price: {
      type: Number,
      required: true,
    },

    oldPrice: {
      type: Number,
    },

    stock: {
      type: Number,
      default: 0,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    rating: {
      type: Number,
      default: 5,
    },

    reviews: {
      type: Number,
      default: 0,
    },

    sku: {
      type: String,
      required: true,
    },

    brand: {
      type: String,
      default: "MAA Fragora",
    },

    volume: {
      type: String,
      default: "100ml",
    },

    gender: {
      type: String,
      enum: ["Men", "Women", "Unisex"],
      default: "Unisex",
    },

    notes: {
      top: {
        type: [String],
        default: [],
      },

      middle: {
        type: [String],
        default: [],
      },

      base: {
        type: [String],
        default: [],
      },
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model<IProduct>(
  "Product",
  productSchema
);

export default Product;