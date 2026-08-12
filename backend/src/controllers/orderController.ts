import { Request, Response } from "express";
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

const parseOrderId = (rawId: string | string[] | undefined): number | null => {
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const parsedId = Number(id);
  return id && Number.isInteger(parsedId) && parsedId > 0
    ? parsedId
    : null;
};

export const createOrder = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = parseUserId(req.userId);

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "User authentication required to place an order",
      });
      return;
    }

    const {
      items,
      totalAmount,
      shippingAddress,
      paymentMethod = "COD",
    } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({
        success: false,
        message: "Order must contain at least one item",
      });
      return;
    }

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
        message: "Complete shipping address is required",
      });
      return;
    }

    const orderItems: Array<any> = [];
    let calculatedTotal = 0;

    for (const item of items) {
      const productId = Number(item.productId);

      if (!Number.isInteger(productId) || productId <= 0) {
        res.status(400).json({
          success: false,
          message: "Invalid product ID in order",
        });
        return;
      }

      const quantity = Number(item.quantity);

      if (!Number.isInteger(quantity) || quantity <= 0) {
        res.status(400).json({
          success: false,
          message: "Product quantity must be greater than zero",
        });
        return;
      }

      const product = await prisma.product.findUnique({
        where: {
          id: productId,
        },
      });

      if (!product) {
        res.status(404).json({
          success: false,
          message: "One or more products no longer exist",
        });
        return;
      }

      if (product.stock < quantity) {
        res.status(400).json({
          success: false,
          message: `${product.name} has only ${product.stock} item(s) available`,
        });
        return;
      }

      const price = Number(product.price);
      const itemTotal = price * quantity;
      calculatedTotal += itemTotal;

      orderItems.push({
        productId,
        name: product.name,
        image: product.images?.[0] ?? "",
        quantity,
        price,
      });
    }

    const normalizedTotal = Number(calculatedTotal.toFixed(2));

    if (
      totalAmount !== undefined &&
      Math.abs(Number(totalAmount) - normalizedTotal) > 0.01
    ) {
      console.warn("Frontend total differs from backend total", {
        frontendTotal: totalAmount,
        backendTotal: normalizedTotal,
      });
    }

    const order = await prisma.order.create({
      data: {
        userId,
        items: orderItems,
        totalAmount: normalizedTotal,
        shippingAddress: {
          fullName: String(shippingAddress.fullName).trim(),
          phone: String(shippingAddress.phone).trim(),
          address: String(shippingAddress.address).trim(),
          city: String(shippingAddress.city).trim(),
          state: String(shippingAddress.state).trim(),
          pincode: String(shippingAddress.pincode).trim(),
        },
        paymentMethod,
        paymentStatus: "Pending",
        orderStatus: "Placed",
      },
    });

    for (const item of orderItems) {
      await prisma.product.update({
        where: {
          id: item.productId,
        },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    const populatedOrder = await prisma.order.findUnique({
      where: {
        id: order.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: populatedOrder,
    });
  } catch (error) {
    console.error("Create Order Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to create order",
    });
  }
};

export const getOrders = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get Orders Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch orders",
    });
  }
};

export const getOrderById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const orderId = parseOrderId(req.params.id);

    if (!orderId) {
      res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
      return;
    }

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

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
    console.error("Get Order Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch order",
    });
  }
};

export const getOrdersByUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const rawUserId = req.params.userId;
    const userId = Number(Array.isArray(rawUserId) ? rawUserId[0] : rawUserId);

    if (!userId || !Number.isInteger(userId) || userId <= 0) {
      res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
      return;
    }

    const orders = await prisma.order.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get User Orders Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch user orders",
    });
  }
};

export const getMyOrders = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = parseUserId(req.userId);

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required to view your orders",
      });
      return;
    }

    const orders = await prisma.order.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get My Orders Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch your orders",
    });
  }
};

export const updateOrderStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const orderId = parseOrderId(req.params.id);

    if (!orderId) {
      res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
      return;
    }

    const { orderStatus, status } = req.body;
    const newStatus = orderStatus || status;

    const allowedStatuses = [
      "Placed",
      "Confirmed",
      "Processing",
      "Shipped",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ];

    if (typeof newStatus !== "string" || !allowedStatuses.includes(newStatus)) {
      res.status(400).json({
        success: false,
        message: "Invalid order status",
        allowedStatuses,
      });
      return;
    }

    const order = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        orderStatus: newStatus,
      },
    });

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Update Order Status Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to update order",
    });
  }
};

export const cancelOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const orderId = parseOrderId(req.params.id);

    if (!orderId) {
      res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
      return;
    }

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });

    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
      return;
    }

    if ([
      "Shipped",
      "Out for Delivery",
      "Delivered",
    ].includes(order.orderStatus)) {
      res.status(400).json({
        success: false,
        message: "This order can no longer be cancelled",
      });
      return;
    }

    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        orderStatus: "Cancelled",
      },
    });

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Cancel Order Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to cancel order",
    });
  }
};
