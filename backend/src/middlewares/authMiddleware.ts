import {
  Request,
  Response,
  NextFunction,
} from "express";

import jwt, {
  JwtPayload,
} from "jsonwebtoken";

import { env } from "../config/env";

/*
|--------------------------------------------------------------------------
| AUTH REQUEST
|--------------------------------------------------------------------------
*/

export interface AuthRequest extends Request {
  userId?: string;
}

/*
|--------------------------------------------------------------------------
| PROTECT MIDDLEWARE
|--------------------------------------------------------------------------
|
| Checks:
| 1. Authorization header exists
| 2. Bearer token exists
| 3. JWT is valid
| 4. JWT contains user id
|
|--------------------------------------------------------------------------
*/

export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader =
      req.headers.authorization;

    /*
    |--------------------------------------------------------------------------
    | Check Authorization Header
    |--------------------------------------------------------------------------
    */

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      res.status(401).json({
        success: false,
        message:
          "Access denied. Please login first.",
      });

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Extract Token
    |--------------------------------------------------------------------------
    */

    const token = authHeader
      .split(" ")[1]
      ?.trim();

    if (!token) {
      res.status(401).json({
        success: false,
        message:
          "Access denied. Invalid authorization token.",
      });

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Verify JWT
    |--------------------------------------------------------------------------
    */

    const decoded = jwt.verify(
      token,
      env.JWT_SECRET
    ) as JwtPayload;

    /*
    |--------------------------------------------------------------------------
    | Validate User ID
    |--------------------------------------------------------------------------
    */

    if (!decoded?.id) {
      res.status(401).json({
        success: false,
        message:
          "Invalid token. User information missing.",
      });

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Attach User ID To Request
    |--------------------------------------------------------------------------
    */

    req.userId = decoded.id as string;

    next();
  } catch (error) {
    console.error(
      "Authentication Error:",
      error
    );

    res.status(401).json({
      success: false,
      message:
        "Invalid or expired token. Please login again.",
    });
  }
};