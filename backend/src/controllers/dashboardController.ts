import { Request, Response } from "express";
import Product from "../models/Product";
import Order from "../models/Order";
import User from "../models/User";

export const getDashboard = async (
  req: Request,
  res: Response
) => {
  try {
    const products = await Product.countDocuments();

    const orders = await Order.countDocuments();

    const customers = await User.countDocuments();

    const revenueResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);

    const revenue =
      revenueResult[0]?.totalRevenue || 0;

    res.json({
      success: true,
      data: {
        products,
        orders,
        customers,
        revenue,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Dashboard Error",
    });
  }
};