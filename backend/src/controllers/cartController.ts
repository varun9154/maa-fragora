import { Response } from "express";
import Cart from "../models/Cart";
import { AuthRequest } from "../middleware/authMiddleware";

/*
-----------------------------------------
GET CART
-----------------------------------------
*/
export const getCart = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    let cart = await Cart.findOne({
      userId: req.userId,
    }).populate("items.productId");

    if (!cart) {
      cart = await Cart.create({
        userId: req.userId,
        items: [],
      });
    }

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch cart",
    });
  }
};

/*
-----------------------------------------
ADD TO CART
-----------------------------------------
*/
export const addToCart = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { productId, quantity = 1 } = req.body;

    let cart = await Cart.findOne({
      userId: req.userId,
    });

    if (!cart) {
      cart = await Cart.create({
        userId: req.userId,
        items: [],
      });
    }

    const existing = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({
        productId,
        quantity,
      });
    }

    await cart.save();

    res.status(201).json({
      success: true,
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to add product",
    });
  }
};

/*
-----------------------------------------
UPDATE QUANTITY
-----------------------------------------
*/
export const updateCartItem = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { quantity } = req.body;

    const cart = await Cart.findOne({
      userId: req.userId,
    });

    if (!cart) {
      res.status(404).json({
        success: false,
        message: "Cart not found",
      });
      return;
    }

    const item = cart.items.find(
      (i) => i.productId.toString() === req.params.productId
    );

    if (!item) {
      res.status(404).json({
        success: false,
        message: "Item not found",
      });
      return;
    }

    item.quantity = quantity;

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Quantity updated",
      cart,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to update cart",
    });
  }
};

/*
-----------------------------------------
REMOVE ITEM
-----------------------------------------
*/
export const removeCartItem = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const cart = await Cart.findOne({
      userId: req.userId,
    });

    if (!cart) {
      res.status(404).json({
        success: false,
        message: "Cart not found",
      });
      return;
    }

    cart.items = cart.items.filter(
      (item) =>
        item.productId.toString() !== req.params.productId
    );

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Item removed",
      cart,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to remove item",
    });
  }
};

/*
-----------------------------------------
CLEAR CART
-----------------------------------------
*/
export const clearCart = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const cart = await Cart.findOne({
      userId: req.userId,
    });

    if (!cart) {
      res.status(404).json({
        success: false,
        message: "Cart not found",
      });
      return;
    }

    cart.items = [];

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to clear cart",
    });
  }
};