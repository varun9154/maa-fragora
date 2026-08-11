import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET =
  process.env.JWT_SECRET?.trim();

const MONGODB_URI =
  process.env.MONGODB_URI?.trim();

const PORT =
  Number(process.env.PORT) || 5000;

if (!JWT_SECRET) {
  throw new Error(
    "JWT_SECRET is missing in backend/.env"
  );
}

if (!MONGODB_URI) {
  throw new Error(
    "MONGODB_URI is missing in backend/.env"
  );
}

export const env = {
  JWT_SECRET,
  MONGODB_URI,
  PORT,
};