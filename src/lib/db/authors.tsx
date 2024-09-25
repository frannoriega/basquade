import prisma from "@/lib/prisma";
import { Author } from "@prisma/client";

async function getAuthors(): Promise<Author[]> {
  return prisma.author.findMany({})
}

export { getAuthors }
