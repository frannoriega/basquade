'use server'
import prisma from "../prisma"

async function getCases() {
  return await prisma.case.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      _count: {
        select: {
          books: true
        }
      }
    }
  })
}

async function getCaseById(id: number) {
  return await prisma.case.findUnique({
    where: {
      id: id
    }
  })
}

type CreateCase = {
  name: string,
  description: string,
  categoryId: number
}

async function createCase(newCase: CreateCase) {
  return await prisma.case.create({
    data: {
      name: newCase.name,
      description: newCase.description,
      categoryId: newCase.categoryId
    }
  })
}

export { getCaseById, getCases, createCase }
