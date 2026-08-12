import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
let connected = false;

export async function connectDatabase() {
  if (!connected) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not configured.");
    }

    await prisma.$connect();
    connected = true;
    console.log("✅ PostgreSQL connected successfully");
  }

  return prisma;
}

export function getDatabaseStatus() {
  return {
    provider: "PostgreSQL",
    connected,
    database: process.env.DATABASE_URL ?? null,
  };
}

export { prisma };
 