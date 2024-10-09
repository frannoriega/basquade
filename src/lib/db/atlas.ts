'use server'
import prisma from "../prisma";

async function getAtlas() {
  return await prisma.atlasRelation.findMany({
    select: {
      start: {
        select: {
          id: true,
          name: true
        }
      },
      end: {
        select: {
          id: true,
          name: true
        }
      },
      description: true
    }
  })
}

type NewAtlas = {
  start: number,
  end: number,
  description?: string
}[]

async function updateAtlas(updatedAtlas: NewAtlas) {
  await prisma.atlasRelation.deleteMany({})
  return await prisma.atlasRelation.createMany({
    data: updatedAtlas.map((a) => {
      return {
        startId: a.start,
        endId: a.end,
        description: a.description,
      }
    })
  })
}

export { getAtlas, updateAtlas }
