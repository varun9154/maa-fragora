import { Request, Response } from "express";
import mongoose from "mongoose";

import Order from "../models/Order";
import Product from "../models/Product";

/*
|--------------------------------------------------------------------------
| Types
|--------------------------------------------------------------------------
*/

interface AuthenticatedRequest extends Request {
  user?: {
    _id?: string;
    id?: string;
    userId?: string;
  };
}

/*
|--------------------------------------------------------------------------
| CREATE ORDER
|--------------------------------------------------------------------------
| POST /api/orders
|--------------------------------------------------------------------------
*/

export const createOrder = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    /*
     * Get logged-in user ID.
     *
     * Supports common authentication
     * structures:
     *
     * req.user._id
     * req.user.id
     * req.user.userId
     */

    const authenticatedUserId =
      req.user?._id ||
      req.user?.id ||
      req.user?.userId;

    /*
     * For development compatibility,
     * allow userId from request body if
     * authentication middleware has not
     * yet been connected.
     *
     * Once authentication is fully connected,
     * remove the body fallback.
     */

    const userId =
      authenticatedUserId ||
      req.body.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message:
          "User authentication required to place an order",
      });

      return;
    }

    if (
      !mongoose.Types.ObjectId.isValid(
        userId
      )
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });

      return;
    }

    const {
      items,
      totalAmount,
      shippingAddress,
      paymentMethod = "COD",
    } = req.body;

    /*
     * Validate items
     */

    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {
      res.status(400).json({
        success: false,
        message:
          "Order must contain at least one item",
      });

      return;
    }

    /*
     * Validate shipping address
     */

    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.pincode
    ) {
      res.status(400).json({
        success: false,
        message:
          "Complete shipping address is required",
      });

      return;
    }

    /*
     * Validate each product and quantity
     */

    const orderItems = [];

    let calculatedTotal = 0;

    for (const item of items) {
      if (
        !item.productId ||
        !mongoose.Types.ObjectId.isValid(
          item.productId
        )
      ) {
        res.status(400).json({
          success: false,
          message:
            "Invalid product ID in order",
        });

        return;
      }

      const quantity = Number(
        item.quantity
      );

      if (
        !Number.isInteger(quantity) ||
        quantity <= 0
      ) {
        res.status(400).json({
          success: false,
          message:
            "Product quantity must be greater than zero",
        });

        return;
      }

      /*
       * Always fetch product from MongoDB.
       *
       * Do NOT trust price/name/image sent
       * from the frontend.
       */

      const product =
        await Product.findById(
          item.productId
        );

      if (!product) {
        res.status(404).json({
          success: false,
          message:
            "One or more products no longer exist",
        });

        return;
      }

      /*
       * Stock validation
       */

      if (product.stock < quantity) {
        res.status(400).json({
          success: false,
          message: `${product.name} has only ${product.stock} item(s) available`,
        });

        return;
      }

      /*
       * Use database price
       */

      const itemTotal =
        Number(product.price) *
        quantity;

      calculatedTotal += itemTotal;

      orderItems.push({
        productId: product._id,
        name: product.name,
        image:
          product.images?.[0] || "",
        quantity,
        price: product.price,
      });
    }

    /*
     * Prevent frontend price manipulation.
     *
     * We calculate the amount ourselves.
     */

    const normalizedTotal =
      Number(calculatedTotal.toFixed(2));

    /*
     * Optional frontend total comparison.
     *
     * Do not fail the order just because
     * frontend and backend have tiny
     * floating-point differences.
     */

    if (
      totalAmount !== undefined &&
      Math.abs(
        Number(totalAmount) -
          normalizedTotal
      ) > 0.01
    ) {
      console.warn(
        "Frontend total differs from backend total",
        {
          frontendTotal: totalAmount,
          backendTotal: normalizedTotal,
        }
      );
    }

    /*
     * Create order
     */

    const order = await Order.create({
      userId: new mongoose.Types.ObjectId(
        userId
      ),

      items: orderItems,

      totalAmount:
        normalizedTotal,

      shippingAddress: {
        fullName:
          String(
            shippingAddress.fullName
          ).trim(),

        phone:
          String(
            shippingAddress.phone
          ).trim(),

        address:
          String(
            shippingAddress.address
          ).trim(),

        city:
          String(
            shippingAddress.city
          ).trim(),

        state:
          String(
            shippingAddress.state
          ).trim(),

        pincode:
          String(
            shippingAddress.pincode
          ).trim(),
      },

      paymentMethod:
        paymentMethod || "COD",

      paymentStatus:
        "Pending",

      orderStatus:
        "Placed",
    });

    /*
     * Reduce stock only after order
     * has successfully been created.
     */

    for (const item of orderItems) {
      await Product.findByIdAndUpdate(
        item.productId,
        {
          $inc: {
            stock: -item.quantity,
          },
        }
      );
    }

    /*
     * Populate response
     */

    const populatedOrder =
      await Order.findById(
        order._id
      )
        .populate(
          "userId",
          "name email"
        )
        .populate(
          "items.productId",
          "name slug images price"
        );

    res.status(201).json({
      success: true,
      message:
        "Order placed successfully",
      order: populatedOrder,
    });
  } catch (error) {
    console.error(
      "Create Order Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to create order",
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET ALL ORDERS
|--------------------------------------------------------------------------
| GET /api/orders
|--------------------------------------------------------------------------
*/

export const getOrders = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const orders =
      await Order.find()
        .populate(
          "userId",
          "name email"
        )
        .populate(
          "items.productId",
          "name slug images price"
        )
        .sort({
          createdAt: -1,
        });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error(
      "Get Orders Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to fetch orders",
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET SINGLE ORDER
|--------------------------------------------------------------------------
| GET /api/orders/:id
|--------------------------------------------------------------------------
*/

export const getOrderById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(
        id
      )
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });

      return;
    }

    const order =
      await Order.findById(id)
        .populate(
          "userId",
          "name email"
        )
        .populate(
          "items.productId",
          "name slug images price"
        );

    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(
      "Get Order Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to fetch order",
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET ORDERS FOR USER
|--------------------------------------------------------------------------
| GET /api/orders/user/:userId
|--------------------------------------------------------------------------
*/

export const getOrdersByUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(
        userId
      )
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });

      return;
    }

    const orders =
      await Order.find({
        userId,
      })
        .populate(
          "items.productId",
          "name slug images price"
        )
        .sort({
          createdAt: -1,
        });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error(
      "Get User Orders Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to fetch user orders",
    });
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE ORDER STATUS
|--------------------------------------------------------------------------
| PUT /api/orders/:id
|--------------------------------------------------------------------------
*/

export const updateOrderStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const {
      orderStatus,
      status,
    } = req.body;

    /*
     * Accept both names for compatibility,
     * but store only orderStatus.
     */

    const newStatus =
      orderStatus || status;

    const allowedStatuses = [
      "Placed",
      "Confirmed",
      "Processing",
      "Shipped",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ];

    if (
      !allowedStatuses.includes(
        newStatus
      )
    ) {
      res.status(400).json({
        success: false,
        message:
          "Invalid order status",
        allowedStatuses,
      });

      return;
    }

    if (
      !mongoose.Types.ObjectId.isValid(
        id
      )
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });

      return;
    }

    const order =
      await Order.findByIdAndUpdate(
        id,
        {
          orderStatus: newStatus,
        },
        {
          new: true,
          runValidators: true,
        }
      )
        .populate(
          "userId",
          "name email"
        )
        .populate(
          "items.productId",
          "name slug images price"
        );

    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      message:
        "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error(
      "Update Order Status Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to update order",
    });
  }
};

/*
|--------------------------------------------------------------------------
| CANCEL ORDER
|--------------------------------------------------------------------------
| PUT /api/orders/:id/cancel
|--------------------------------------------------------------------------
*/

export const cancelOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(
        id
      )
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });

      return;
    }

    const order =
      await Order.findById(id);

    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });

      return;
    }

    if (
      [
        "Shipped",
        "Out for Delivery",
        "Delivered",
      ].includes(
        order.orderStatus
      )
    ) {
      res.status(400).json({
        success: false,
        message:
          "This order can no longer be cancelled",
      });

      return;
    }

    order.orderStatus =
      "Cancelled";

    await order.save();

    res.status(200).json({
      success: true,
      message:
        "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error(
      "Cancel Order Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to cancel order",
    });
  }
};