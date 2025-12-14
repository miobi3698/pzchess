import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { ENV } from "./env";
import { PrismaClient } from "@/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({ url: ENV.DATABASE_URL });
export const prisma = new PrismaClient({ adapter });
