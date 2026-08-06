import { Request, Response } from "express";
import Product from "../models/Product";

/**
 * GET ALL PRODUCTS
 * Search
 * Pagination
 * Featured
 * Category Filter
 */
export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const search = (req.query.search as string) || "";
    const category = (req.query.category as string) || "";
    const featured = req.query.featured === "true";

    const query: Record<string, unknown> = {};

    if (search) {
      query.name = {
        $regex: search,
        $options: "i",
      };
    }

    if (category) {
      query.category = category;
    }

    if (featured) {
      query.featured = true;
    }

    const total = await Product.countDocuments(query);

    const products = await Product.find(query)
      .skip(skip)
      .limit(limit)
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,

      total,

      page,

      totalPages: Math.ceil(total / limit),

      count: products.length,

      products,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch products",
    });
  }
};

/**
 * GET PRODUCT BY SLUG
 */

export const getProductBySlug = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
    });

    if (!product) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch product",
    });
  }
};

/**
 * CREATE PRODUCT
 */

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to create product",
    });
  }
};

/**
 * UPDATE PRODUCT
 */

export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      message: "Product updated",
      product,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to update product",
    });
  }
};

/**
 * DELETE PRODUCT
 */

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });

      return;
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to delete product",
    });
  }
};