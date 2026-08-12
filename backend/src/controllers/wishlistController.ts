import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { prisma } from "../config/database";

const parseUserId = (userId?: string): number | null => {
  if (!userId) {
    return null;
  }

  const parsedId = Number(userId);
  return Number.isInteger(parsedId) && parsedId > 0
    ? parsedId
    : null;
};

const buildWishlistResponse = async (wishlist: any) => {
  const items = Array.isArray(wishlist.items)
    ? wishlist.items as Array<{ productId: number }> 
    : [];

  const productIds = items
    .map((item) => Number(item.productId))
    .filter((productId: number) => Number.isInteger(productId));

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  const productMap = new Map<number, any>(
    products.map((product: any) => [product.id, product])
  );

  return {
    ...wishlist,
    items: items.map((item: any) => {
      const product = productMap.get(Number(item.productId));

      if (!product) {
        return item;
      }

      return {
        ...item,
        productId: {
          ...product,
          _id: String(product.id),
        },
      };
    }),
  };
};

export const getWishlist = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = parseUserId(req.userId);

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    let wishlist = await prisma.wishlist.findUnique({
      where: {
        userId,
      },
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: {
          userId,
          items: [],
        },
      });
    }

    const populatedWishlist = await buildWishlistResponse(wishlist);

    res.status(200).json({
      success: true,
      wishlist: populatedWishlist,
    });
  } catch (error) {
    console.error("Get Wishlist Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch wishlist",
    });
  }
};

export const addToWishlist = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = parseUserId(req.userId);

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const { productId } = req.body;
    const parsedProductId = Number(productId);

    if (!Number.isInteger(parsedProductId) || parsedProductId <= 0) {
      res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
      return;
    }

    let wishlist = await prisma.wishlist.findUnique({
      where: {
        userId,
      },
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: {
          userId,
          items: [],
        },
      });
    }

    const items = Array.isArray(wishlist.items)
      ? [...wishlist.items]
      : [];

    const exists = items.some(
      (item: any) => Number(item.productId) === parsedProductId
    );

    if (!exists) {
      items.push({ productId: parsedProductId });
    }

    const updatedWishlist = await prisma.wishlist.update({
      where: {
        userId,
      },
      data: {
        items,
      },
    });

    const populatedWishlist = await buildWishlistResponse(updatedWishlist);

    res.status(201).json({
      success: true,
      message: "Added to wishlist",
      wishlist: populatedWishlist,
    });
  } catch (error) {
    console.error("Add Wishlist Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to add wishlist item",
    });
  }
};

export const removeWishlistItem = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = parseUserId(req.userId);

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const rawProductId = req.params.productId;
    const productId = Number(Array.isArray(rawProductId) ? rawProductId[0] : rawProductId);

    if (!Number.isInteger(productId) || productId <= 0) {
      res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
      return;
    }

    const wishlist = await prisma.wishlist.findUnique({
      where: {
        userId,
      },
    });

    if (!wishlist) {
      res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
      return;
    }

    const items = Array.isArray(wishlist.items)
      ? wishlist.items.filter(
          (item: any) => Number(item.productId) !== productId
        )
      : [];

    const updatedWishlist = await prisma.wishlist.update({
      where: {
        userId,
      },
      data: {
        items,
      },
    });

    const populatedWishlist = await buildWishlistResponse(updatedWishlist);

    res.status(200).json({
      success: true,
      message: "Removed from wishlist",
      wishlist: populatedWishlist,
    });
  } catch (error) {
    console.error("Remove Wishlist Item Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to remove wishlist item",
    });
  }
};
