import { Response, NextFunction } from "express";
import User from "../models/User";
import { AuthRequest } from "./authMiddleware";

export const adminOnly = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {

    const user = await User.findById(req.userId);

    if (!user || user.role !== "admin") {

        return res.status(403).json({

            success: false,

            message: "Admin access required"

        });

    }

    next();

};