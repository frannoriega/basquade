import prisma from "../prisma";

async function getProcessing() {
  return await prisma.pending.findMany({})
}

export { getProcessing }
