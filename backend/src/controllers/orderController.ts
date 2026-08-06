import { Response } from "express";
import Order from "../models/Order";
import Cart from "../models/Cart";
import { AuthRequest } from "../middleware/authMiddleware";

/*
-----------------------------------------
CREATE ORDER
-----------------------------------------
*/

export const createOrder = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const cart = await Cart.findOne({
      userId: req.userId,
    }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
      res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
      return;
    }

    const items = cart.items.map((item: any) => ({
      productId: item.productId._id,
      name: item.productId.name,
      image: item.productId.images[0],
      quantity: item.quantity,
      price: item.productId.price,
    }));

    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = await Order.create({
      userId: req.userId,
      items,
      totalAmount,
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod ?? "COD",
    });

    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to create order",
    });
  }
};

/*
-----------------------------------------
GET MY ORDERS
-----------------------------------------
*/

export const getOrders = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const orders = await Order.find({
      userId: req.userId,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch orders",
    });
  }
};