import jwt from "jsonwebtoken";

import { env } from "../config/env";

export const generateToken = (
  userId: string
): string => {
  if (!userId) {
    throw new Error(
      "User ID is required to generate token"
    );
  }

  return jwt.sign(
    {
      id: userId,
    },
    env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};