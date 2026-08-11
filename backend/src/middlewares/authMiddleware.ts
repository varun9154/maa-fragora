import {
  Request,
  Response,
  NextFunction,
} from "express";

import jwt from "jsonwebtoken";

import { env } from "../config/env";

export interface AuthRequest
  extends Request {
  userId?: string;
}

export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader =
      req.headers.authorization;

    console.log(
      "========== AUTH DEBUG =========="
    );

    console.log(
      "Authorization exists:",
      Boolean(authHeader)
    );

    console.log(
      "JWT_SECRET exists:",
      Boolean(env.JWT_SECRET)
    );

    console.log(
      "JWT_SECRET length:",
      env.JWT_SECRET?.length
    );

    if (
      !authHeader ||
      !authHeader.startsWith(
        "Bearer "
      )
    ) {
      console.log(
        "RESULT: Authorization header missing"
      );

      res.status(401).json({
        success: false,
        message:
          "Authentication required",
      });

      return;
    }

    const token =
      authHeader
        .substring(7)
        .trim();

    console.log(
      "Token exists:",
      Boolean(token)
    );

    console.log(
      "Token length:",
      token.length
    );

    /*
     * IMPORTANT:
     * We do NOT print the actual token.
     */

    const decoded =
      jwt.verify(
        token,
        env.JWT_SECRET
      ) as jwt.JwtPayload;

    console.log(
      "JWT VERIFIED SUCCESSFULLY"
    );

    console.log(
      "Decoded user ID:",
      decoded.id
    );

    if (
      !decoded.id ||
      typeof decoded.id !==
        "string"
    ) {
      console.log(
        "RESULT: JWT has no valid user ID"
      );

      res.status(401).json({
        success: false,
        message:
          "Invalid authentication token",
      });

      return;
    }

    req.userId =
      decoded.id;

    console.log(
      "Authenticated userId:",
      req.userId
    );

    console.log(
      "================================"
    );

    next();
  } catch (error: any) {
    console.log(
      "========== JWT FAILED =========="
    );

    console.log(
      "Error name:",
      error?.name
    );

    console.log(
      "Error message:",
      error?.message
    );

    console.log(
      "================================"
    );

    res.status(401).json({
      success: false,
      message:
        "Invalid or expired token",
      debug:
        process.env.NODE_ENV !==
        "production"
          ? error?.message
          : undefined,
    });

    return;
  }
};