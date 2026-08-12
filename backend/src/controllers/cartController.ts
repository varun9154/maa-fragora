import { AuthRequest } from "../middlewares/authMiddleware";
import { prisma } from "../config/database";
import { Response } from "express";

const parseUserId = (userId?: string): number | null => {
  if (!userId) {
    return null;
  }

  const parsedId = Number(userId);
  return Number.isInteger(parsedId) && parsedId > 0
    ? parsedId
    : null;
};

const buildCartResponse = async (cart: any) => {
  const items = Array.isArray(cart.items)
    ? cart.items as Array<{ productId: number; quantity: number }>
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
    ...cart,
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

export const getCart = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = parseUserId(req.userId);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    let cart = await prisma.cart.findUnique({
      where: {
        userId,
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId,
          items: [],
        },
      });
    }

    const populatedCart = await buildCartResponse(cart);

    return res.status(200).json({
      success: true,
      cart: populatedCart,
    });
  } catch (error) {
    console.error("Get Cart Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch cart",
    });
  }
};

export const addToCart = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = parseUserId(req.userId);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { productId, quantity = 1 } = req.body;
    const parsedProductId = Number(productId);
    const parsedQuantity = Number(quantity);

    if (!Number.isInteger(parsedProductId) || parsedProductId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive integer",
      });
    }

    const product = await prisma.product.findUnique({
      where: {
        id: parsedProductId,
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.stock < parsedQuantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock",
      });
    }

    let cart = await prisma.cart.findUnique({
      where: {
        userId,
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId,
          items: [],
        },
      });
    }

    const items = Array.isArray(cart.items)
      ? [...cart.items]
      : [];

    const existingItem = items.find(
      (item: any) => Number(item.productId) === parsedProductId
    );

    if (existingItem) {
      const ex: any = existingItem;
      ex.quantity = Number(ex.quantity) + parsedQuantity;
    } else {
      items.push({
        productId: parsedProductId,
        quantity: parsedQuantity,
      });
    }

    cart = await prisma.cart.update({
      where: {
        userId,
      },
      data: {
        items,
      },
    });

    const populatedCart = await buildCartResponse(cart);

    return res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart: populatedCart,
    });
  } catch (error) {
    console.error("Add To Cart Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to add product to cart",
    });
  }
};

export const updateCart = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = parseUserId(req.userId);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const rawProductId = req.params.productId;
    const productId = Number(Array.isArray(rawProductId) ? rawProductId[0] : rawProductId);
    const quantity = Number(req.body.quantity);

    if (!Number.isInteger(productId) || productId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive integer",
      });
    }

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock",
      });
    }

    const cart = await prisma.cart.findUnique({
      where: {
        userId,
      },
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const items = Array.isArray(cart.items)
      ? [...cart.items]
      : [];

    const item = items.find(
      (cartItem: any) => Number(cartItem.productId) === productId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Product is not in cart",
      });
    }

    (item as any).quantity = quantity;

    const updatedCart = await prisma.cart.update({
      where: {
        userId,
      },
      data: {
        items,
      },
    });

    const populatedCart = await buildCartResponse(updatedCart);

    return res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cart: populatedCart,
    });
  } catch (error) {
    console.error("Update Cart Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update cart",
    });
  }
};

export const removeCartItem = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = parseUserId(req.userId);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const rawProductId = req.params.productId;
    const productId = Number(Array.isArray(rawProductId) ? rawProductId[0] : rawProductId);

    if (!Number.isInteger(productId) || productId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const cart = await prisma.cart.findUnique({
      where: {
        userId,
      },
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const items = Array.isArray(cart.items)
      ? cart.items.filter(
          (item: any) => Number(item.productId) !== productId
        )
      : [];

    const updatedCart = await prisma.cart.update({
      where: {
        userId,
      },
      data: {
        items,
      },
    });

    const populatedCart = await buildCartResponse(updatedCart);

    return res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart: populatedCart,
    });
  } catch (error) {
    console.error("Remove Cart Item Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to remove cart item",
    });
  }
};

export const clearCart = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = parseUserId(req.userId);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const cart = await prisma.cart.findUnique({
      where: {
        userId,
      },
    });

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart already empty",
      });
    }

    const updatedCart = await prisma.cart.update({
      where: {
        userId,
      },
      data: {
        items: [],
      },
    });

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Clear Cart Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to clear cart",
    });
  }
};
