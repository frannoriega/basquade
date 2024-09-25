import prisma from "@/lib/prisma";
import { Lang } from "@prisma/client";

async function getLanguages(): Promise<Lang[]> {
  return await prisma.lang.findMany()
}

export { getLanguages }
