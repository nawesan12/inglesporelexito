import { PrismaClient } from "@/generated/client";

const prismaClientSingleton = () =>
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

const globalPrismaKey = Symbol.for("prisma.client");

type GlobalWithPrismaClient = typeof globalThis & {
  [globalPrismaKey]?: ReturnType<typeof prismaClientSingleton>;
};

const globalWithPrisma = globalThis as GlobalWithPrismaClient;

export const prisma =
  globalWithPrisma[globalPrismaKey] ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalWithPrisma[globalPrismaKey] = prisma;
}
