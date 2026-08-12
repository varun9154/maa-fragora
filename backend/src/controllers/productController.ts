import { Request, Response } from "express";
import { prisma } from "../config/database";

export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = String(req.query.search ?? "").trim();
    const category = String(req.query.category ?? "").trim();
    const featured = req.query.featured === "true";

    const where: any = {};

    if (search) {
      where.name = {
        contains: search,
        mode: "insensitive",
      };
    }

    if (category) {
      where.category = category;
    }

    if (featured) {
      where.featured = true;
    }

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

    res.status(200).json({
      success: true,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get Products Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch products",
    });
  }
};

export const getProductBySlug = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const slug = Array.isArray(req.params.slug)
      ? req.params.slug[0]
      : req.params.slug;

    const product = await prisma.product.findUnique({
      where: {
        slug: slug,
      },
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
    console.error("Get Product By Slug Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch product",
    });
  }
};

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data = {
      ...req.body,
      price: Number(req.body.price),
      oldPrice:
        req.body.oldPrice !== undefined
          ? Number(req.body.oldPrice)
          : undefined,
      stock: Number(req.body.stock ?? 0),
      featured: Boolean(req.body.featured),
      rating: Number(req.body.rating ?? 5),
      reviews: Number(req.body.reviews ?? 0),
      images: Array.isArray(req.body.images)
        ? req.body.images
        : [],
    };

    const product = await prisma.product.create({
      data,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create Product Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to create product",
    });
  }
};

export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    const productId = Number(id);

    if (!id || !Number.isInteger(productId) || productId <= 0) {
      res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
      return;
    }

    const data: any = {
      ...req.body,
    };

    if (req.body.price !== undefined) {
      data.price = Number(req.body.price);
    }

    if (req.body.oldPrice !== undefined) {
      data.oldPrice = Number(req.body.oldPrice);
    }

    if (req.body.stock !== undefined) {
      data.stock = Number(req.body.stock);
    }

    if (req.body.featured !== undefined) {
      data.featured = Boolean(req.body.featured);
    }

    if (req.body.rating !== undefined) {
      data.rating = Number(req.body.rating);
    }

    if (req.body.reviews !== undefined) {
      data.reviews = Number(req.body.reviews);
    }

    if (req.body.images !== undefined) {
      data.images = Array.isArray(req.body.images)
        ? req.body.images
        : [];
    }

    const product = await prisma.product.update({
      where: {
        id: productId,
      },
      data,
    });

    res.status(200).json({
      success: true,
      message: "Product updated",
      product,
    });
  } catch (error) {
    console.error("Update Product Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to update product",
    });
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    const productId = Number(id);

    if (!id || !Number.isInteger(productId) || productId <= 0) {
      res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
      return;
    }

    await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete Product Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to delete product",
    });
  }
};
