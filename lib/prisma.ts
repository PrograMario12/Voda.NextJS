import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const connectionString = process.env.DATABASE_URL || "postgresql://user:password@localhost:5432/db_name?schema=public";

const prismaClientSingleton = () => {
  // Log para depuración (visible en la terminal de Next.js)
  console.log(
    "Initializing Prisma with URL:",
    connectionString.replace(/:[^:@]+@/, ":***@"),
  );

  // En Prisma 7, lo más compatible es pasar el objeto de configuración de pg
  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

declare const globalThis: {
  prismaGlobalV2: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

// Cambiamos el nombre a prismaGlobalV2 para forzar la recreación si había basura en memoria
const prisma = globalThis.prismaGlobalV2 ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobalV2 = prisma;
