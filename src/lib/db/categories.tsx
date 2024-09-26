import prisma from "@/lib/prisma";
import { Category, Prisma } from "@prisma/client";

async function getCategory(id: number): Promise<CategoryWithoutIcon | null> {
  return prisma.category.findUnique({
    select: {
      id: true,
      name: true
    },
    where: {
      id: id
    }
  })
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

export { getCategory, getUsedCategories, getCategories }
