import prisma from "@/lib/prisma";
import { Shelf, Prisma } from "@prisma/client";

async function getShelfCount(): Promise<number> {
  return await prisma.shelf.count({})
}

async function getShelf(id: number): Promise<ShelfWithoutIcon | null> {
  return prisma.shelf.findUnique({
    select: {
      id: true,
      name: true
    },
    where: {
      id: id
    }
  })
}

async function getUsedShelves(): Promise<Shelf[]> {
  return prisma.shelf.findMany({
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

type ShelfWithoutIcon = Prisma.ShelfGetPayload<{
  select: { id: true, name: true }
}>

async function getShelves(): Promise<ShelfWithoutIcon[]> {
  return prisma.shelf.findMany({
    select: {
      id: true,
      name: true
    }
  })
}

export { getShelfCount, getShelf, getUsedShelves, getShelves }
