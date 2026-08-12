import { Response, NextFunction } from "express";
import { prisma } from "../config/database";
import { AuthRequest } from "./authMiddleware";

export const adminOnly = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: Number(req.userId),
    },
  });

  if (!user || user.role !== "ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }

  next();
};
