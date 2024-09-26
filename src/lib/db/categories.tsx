import prisma from "@/lib/prisma";
import { Category, Prisma } from "@prisma/client";

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

type CategoryWithoutIcon = Prisma.CategoryGetPayload<{
  select: { id: true, name: true }
}>

async function getCategories(): Promise<CategoryWithoutIcon[]> {
  return prisma.category.findMany({
    select: {
      id: true,
      name: true
    }
  })
}

export { getUsedCategories, getCategories, exists }
