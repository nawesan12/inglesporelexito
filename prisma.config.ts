import { loadEnvConfig } from "@next/env";
import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "prisma/config";

loadEnvConfig(process.cwd());

const databaseUrl = resolveDatabaseUrl();

if (!databaseUrl) {
  throw new Error(
    "Missing DATABASE_URL environment variable. Set it in your environment or provide a path via DATABASE_URL_FILE."
  );
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: databaseUrl,
  },
});

function resolveDatabaseUrl(): string | undefined {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  if (process.env.DATABASE_URL_FILE) {
    const filePath = path.resolve(process.cwd(), process.env.DATABASE_URL_FILE);

    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, "utf8").trim();
    }
  }

  if (process.env.POSTGRES_URL) {
    return process.env.POSTGRES_URL;
  }

  return undefined;
}
