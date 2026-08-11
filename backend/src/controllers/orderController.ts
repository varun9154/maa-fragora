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
     * Get authenticated user ID.
     */

    const authenticatedUserId =
      req.user?._id ||
      req.user?.id ||
      req.user?.userId;

    /*
     * Fallback to body userId for
     * existing checkout compatibility.
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

    /*
     * Validate user ID.
     */

    if (
      typeof userId !== "string" ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });

      return;
    }

    /*
     * Request data.
     */

    const {
      items,
      totalAmount,
      shippingAddress,
      paymentMethod = "COD",
    } = req.body;

    /*
     * Validate items.
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
     * Validate shipping address.
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
     * Build order items from database products.
     */

    const orderItems: any[] = [];

    let calculatedTotal = 0;

    for (const item of items) {
      /*
       * Product ID validation.
       */

      const productId =
        typeof item.productId === "string"
          ? item.productId
          : "";

      if (
        !productId ||
        !mongoose.Types.ObjectId.isValid(
          productId
        )
      ) {
        res.status(400).json({
          success: false,
          message:
            "Invalid product ID in order",
        });

        return;
      }

      /*
       * Quantity validation.
       */

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
       * Get product from database.
       */

      const product =
        await Product.findById(
          productId
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
       * Stock validation.
       */

      if (
        typeof product.stock === "number" &&
        product.stock < quantity
      ) {
        res.status(400).json({
          success: false,
          message: `${product.name} has only ${product.stock} item(s) available`,
        });

        return;
      }

      /*
       * Calculate using database price.
       */

      const price =
        Number(product.price);

      const itemTotal =
        price * quantity;

      calculatedTotal += itemTotal;

      /*
       * Add item.
       */

      orderItems.push({
        productId: product._id,
        name: product.name,
        image:
          product.images?.[0] || "",
        quantity,
        price,
      });
    }

    /*
     * Backend calculated total.
     */

    const normalizedTotal =
      Number(
        calculatedTotal.toFixed(2)
      );

    /*
     * Warn if frontend total differs.
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
          frontendTotal:
            totalAmount,
          backendTotal:
            normalizedTotal,
        }
      );
    }

    /*
     * Create order.
     */

    const order =
      await Order.create({
        userId:
          new mongoose.Types.ObjectId(
            userId
          ),

        items:
          orderItems,

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
     * Reduce stock.
     */

    for (const item of orderItems) {
      await Product.findByIdAndUpdate(
        item.productId,
        {
          $inc: {
            stock:
              -item.quantity,
          },
        }
      );
    }

    /*
     * Populate order response.
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
      order:
        populatedOrder,
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
      count:
        orders.length,
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
    /*
     * Express 5 may type params as
     * string | string[].
     */

    const rawId = req.params.id;

    const id = Array.isArray(rawId)
      ? rawId[0]
      : rawId;

    if (!id) {
      res.status(400).json({
        success: false,
        message:
          "Order ID is required",
      });

      return;
    }

    /*
     * Validate MongoDB ObjectId.
     */

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      res.status(400).json({
        success: false,
        message:
          "Invalid order ID",
      });

      return;
    }

    /*
     * Find order.
     */

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
        message:
          "Order not found",
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
| GET ORDERS BY USER
|--------------------------------------------------------------------------
| GET /api/orders/user/:userId
|--------------------------------------------------------------------------
*/

export const getOrdersByUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const rawUserId =
      req.params.userId;

    const userId =
      Array.isArray(rawUserId)
        ? rawUserId[0]
        : rawUserId;

    if (!userId) {
      res.status(400).json({
        success: false,
        message:
          "User ID is required",
      });

      return;
    }

    /*
     * Validate user ID.
     */

    if (
      !mongoose.Types.ObjectId.isValid(
        userId
      )
    ) {
      res.status(400).json({
        success: false,
        message:
          "Invalid user ID",
      });

      return;
    }

    /*
     * Find user's orders.
     */

    const orders =
      await Order.find({
        userId:
          new mongoose.Types.ObjectId(
            userId
          ),
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
      count:
        orders.length,
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
| GET MY ORDERS
|--------------------------------------------------------------------------
| GET /api/orders/my-orders
|--------------------------------------------------------------------------
| Authenticated customer orders.
|--------------------------------------------------------------------------
*/

export const getMyOrders = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    /*
     * Get logged-in user ID.
     */

    const userId =
      req.user?._id ||
      req.user?.id ||
      req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message:
          "Authentication required to view your orders",
      });

      return;
    }

    /*
     * Make sure userId is a string.
     */

    if (typeof userId !== "string") {
      res.status(400).json({
        success: false,
        message:
          "Invalid authenticated user ID",
      });

      return;
    }

    /*
     * Validate MongoDB ObjectId.
     */

    if (
      !mongoose.Types.ObjectId.isValid(
        userId
      )
    ) {
      res.status(400).json({
        success: false,
        message:
          "Invalid user ID",
      });

      return;
    }

    /*
     * Fetch only this customer's orders.
     */

    const orders =
      await Order.find({
        userId:
          new mongoose.Types.ObjectId(
            userId
          ),
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
      count:
        orders.length,
      orders,
    });
  } catch (error) {
    console.error(
      "Get My Orders Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to fetch your orders",
    });
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE ORDER STATUS
|--------------------------------------------------------------------------
| PUT /api/orders/:id/status
|--------------------------------------------------------------------------
*/

export const updateOrderStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    /*
     * Express 5 parameter handling.
     */

    const rawId = req.params.id;

    const id = Array.isArray(rawId)
      ? rawId[0]
      : rawId;

    if (!id) {
      res.status(400).json({
        success: false,
        message:
          "Order ID is required",
      });

      return;
    }

    /*
     * Accept both:
     *
     * {
     *   orderStatus: "Shipped"
     * }
     *
     * and
     *
     * {
     *   status: "Shipped"
     * }
     */

    const {
      orderStatus,
      status,
    } = req.body;

    const newStatus =
      orderStatus ||
      status;

    /*
     * Allowed order statuses.
     */

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
      typeof newStatus !== "string" ||
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

    /*
     * Validate order ID.
     */

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      res.status(400).json({
        success: false,
        message:
          "Invalid order ID",
      });

      return;
    }

    /*
     * Update order.
     */

    const order =
      await Order.findByIdAndUpdate(
        id,
        {
          orderStatus:
            newStatus,
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
        message:
          "Order not found",
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
    /*
     * Express 5 parameter handling.
     */

    const rawId = req.params.id;

    const id = Array.isArray(rawId)
      ? rawId[0]
      : rawId;

    if (!id) {
      res.status(400).json({
        success: false,
        message:
          "Order ID is required",
      });

      return;
    }

    /*
     * Validate order ID.
     */

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      res.status(400).json({
        success: false,
        message:
          "Invalid order ID",
      });

      return;
    }

    /*
     * Find order.
     */

    const order =
      await Order.findById(id);

    if (!order) {
      res.status(404).json({
        success: false,
        message:
          "Order not found",
      });

      return;
    }

    /*
     * Prevent cancellation after
     * shipment has started.
     */

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

    /*
     * Cancel order.
     */

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