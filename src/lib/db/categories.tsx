import prisma from "@/lib/prisma";
import { Category } from "@prisma/client";

async function getUsedCategories(): Promise<Category[]> {
  return prisma.category.findMany({
    where: {
      books: {
        some: {}
      }
    }
  })
}

export { getUsedCategories }
