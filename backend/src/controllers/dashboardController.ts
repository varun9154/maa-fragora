import { prisma } from "../config/database";
import { Request, Response } from "express";

export const getDashboard = async (
  _req: Request,
  res: Response
) => {
  try {
    const products = await prisma.product.count();

    const orders = await prisma.order.count();

    const customers = await prisma.user.count();

    const revenueResult = await prisma.order.aggregate({
      _sum: {
        totalAmount: true,
      },
    });

    const revenue = revenueResult._sum.totalAmount ?? 0;

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
    console.error("Dashboard Error:", error);

    res.status(500).json({
      success: false,
      message: "Dashboard Error",
    });
  }
};
