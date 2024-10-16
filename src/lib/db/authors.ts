import prisma from "@/lib/prisma";
import { Author } from "@prisma/client";

async function getAuthorCount(): Promise<number> {
  return await prisma.author.count({})
}
async function getAuthors(): Promise<Author[]> {
  return await prisma.author.findMany({})
}

export { getAuthorCount, getAuthors }
