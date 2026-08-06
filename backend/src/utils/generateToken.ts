import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

export function generateToken(userId: string): string {
  const secret: Secret = env.JWT_SECRET;

  const options: SignOptions = {
    expiresIn: "7d",
  };

  return jwt.sign(
    {
      id: userId,
    },
    secret,
    options
  );
}