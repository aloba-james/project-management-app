import { config as loadEnv } from "dotenv";
import fs from "fs";
import path from "path";
import { PrismaClient } from "@/generated/prisma3";

function readEnvFile(filePath: string): Record<string, string> {
  if (!fs.existsSync(filePath)) return {};
  const parsed = loadEnv({ path: filePath, processEnv: {} });
  return (parsed.parsed ?? {}) as Record<string, string>;
}

function resolveDatabaseUrl(): string {
  if (process.env.DATABASE_URL?.trim()) {
    return process.env.DATABASE_URL.trim();
  }

  const candidates = [
    path.resolve(process.cwd(), ".env"),
    path.resolve(process.cwd(), "../server/.env"),
    path.resolve(process.cwd(), "../../server/.env"),
  ];

  for (const filePath of candidates) {
    const values = readEnvFile(filePath);
    const url = values.DATABASE_URL?.trim();
    if (url) {
      process.env.DATABASE_URL = url;
      return url;
    }
  }

  throw new Error(
    "DATABASE_URL is not set. Add it to client/.env or server/.env, then restart next dev.",
  );
}

const databaseUrl = resolveDatabaseUrl();

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: { url: databaseUrl },
    },
    log:
      process.env.NODE_ENV === "development"
        ? ["error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export type { PrismaClient };
