import prisma from "@/lib/prisma";
import { Category } from "@prisma/client";

async function exists(cat: number): Promise<boolean> {
  return prisma.category.findFirst({
    where: {
      id: cat
    }
  }).then((res) => res != null)
}

async function getUsedCategories(): Promise<Category[]> {
  return prisma.category.findMany({
    where: {
      books: {
        some: {}
      }
    },
    orderBy: {
      name: 'asc'
    }
  })
}

export { getUsedCategories, exists }
