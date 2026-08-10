import { Request, Response } from "express";

import Cart from "../models/Cart";
import Product from "../models/Product";

/*
|--------------------------------------------------------------------------
| Helper
|--------------------------------------------------------------------------
*/

const getUserId = (req: Request) => {
  const user = (req as any).user;

  return user?._id || user?.id;
};

/*
|--------------------------------------------------------------------------
| GET CART
|--------------------------------------------------------------------------
*/

export const getCart = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    let cart = await Cart.findOne({
      userId,
    }).populate(
      "items.productId",
      "name slug images price stock category"
    );

    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [],
      });
    }

    return res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error(
      "Get Cart Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch cart",
    });
  }
};

/*
|--------------------------------------------------------------------------
| ADD TO CART
|--------------------------------------------------------------------------
*/

export const addToCart = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const {
      productId,
      quantity = 1,
    } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const parsedQuantity =
      Number(quantity);

    if (
      !Number.isInteger(
        parsedQuantity
      ) ||
      parsedQuantity <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Quantity must be a positive integer",
      });
    }

    /*
     * Check product
     */

    const product =
      await Product.findById(
        productId
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    /*
     * Check stock
     */

    if (
      typeof product.stock ===
        "number" &&
      product.stock <
        parsedQuantity
    ) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock",
      });
    }

    /*
     * Find user's cart
     */

    let cart = await Cart.findOne({
      userId,
    });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [],
      });
    }

    /*
     * Check existing item
     */

    const existingItem =
      cart.items.find(
        (item: any) =>
          item.productId.toString() ===
          productId
      );

    if (existingItem) {
      existingItem.quantity +=
        parsedQuantity;
    } else {
      cart.items.push({
        productId,
        quantity:
          parsedQuantity,
      });
    }

    await cart.save();

    /*
     * Populate product information
     */

    await cart.populate(
      "items.productId",
      "name slug images price stock category"
    );

    return res.status(200).json({
      success: true,
      message:
        "Product added to cart",
      cart,
    });
  } catch (error) {
    console.error(
      "Add To Cart Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to add product to cart",
    });
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE CART
|--------------------------------------------------------------------------
*/

export const updateCart = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const {
      productId,
    } = req.params;

    const {
      quantity,
    } = req.body;

    const parsedQuantity =
      Number(quantity);

    if (
      !Number.isInteger(
        parsedQuantity
      ) ||
      parsedQuantity <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Quantity must be a positive integer",
      });
    }

    const product =
      await Product.findById(
        productId
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (
      typeof product.stock ===
        "number" &&
      product.stock <
        parsedQuantity
    ) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock",
      });
    }

    const cart =
      await Cart.findOne({
        userId,
      });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item =
      cart.items.find(
        (cartItem: any) =>
          cartItem.productId.toString() ===
          productId
      );

    if (!item) {
      return res.status(404).json({
        success: false,
        message:
          "Product is not in cart",
      });
    }

    item.quantity =
      parsedQuantity;

    await cart.save();

    await cart.populate(
      "items.productId",
      "name slug images price stock category"
    );

    return res.status(200).json({
      success: true,
      message:
        "Cart updated successfully",
      cart,
    });
  } catch (error) {
    console.error(
      "Update Cart Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to update cart",
    });
  }
};

/*
|--------------------------------------------------------------------------
| REMOVE CART ITEM
|--------------------------------------------------------------------------
*/

export const removeCartItem =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const userId =
        getUserId(req);

      if (!userId) {
        return res.status(401).json({
          success: false,
          message:
            "Authentication required",
        });
      }

      const {
        productId,
      } = req.params;

      const cart =
        await Cart.findOne({
          userId,
        });

      if (!cart) {
        return res.status(404).json({
          success: false,
          message:
            "Cart not found",
        });
      }

      cart.items =
        cart.items.filter(
          (item: any) =>
            item.productId.toString() !==
            productId
        ) as any;

      await cart.save();

      await cart.populate(
        "items.productId",
        "name slug images price stock category"
      );

      return res.status(200).json({
        success: true,
        message:
          "Product removed from cart",
        cart,
      });
    } catch (error) {
      console.error(
        "Remove Cart Item Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to remove cart item",
      });
    }
  };

/*
|--------------------------------------------------------------------------
| CLEAR CART
|--------------------------------------------------------------------------
*/

export const clearCart = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required",
      });
    }

    const cart =
      await Cart.findOne({
        userId,
      });

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart already empty",
      });
    }

    cart.items = [];

    await cart.save();

    return res.status(200).json({
      success: true,
      message:
        "Cart cleared successfully",
      cart,
    });
  } catch (error) {
    console.error(
      "Clear Cart Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to clear cart",
    });
  }
};