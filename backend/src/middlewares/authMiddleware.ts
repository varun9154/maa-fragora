import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface AuthRequest extends Request {
  userId?: string;
}

export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const token = authHeader.slice(7).trim();
    const decoded =
      jwt.verify(token, env.JWT_SECRET) as
        | jwt.JwtPayload
        | undefined;

    if (!decoded || !decoded.id || typeof decoded.id !== "string") {
      res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
      return;
    }

    req.userId = decoded.id;
    next();
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      debug:
        process.env.NODE_ENV !== "production"
          ? error?.message
          : undefined,
    });
  }
};
