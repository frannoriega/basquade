import { getDocuments } from "@/data/documents";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const documents = await getDocuments();

  if (!documents) {
    return null;
  }

  documents.map(async (document) => {
    await prisma.document.create({
      data: {
        title: document.title,
      },
    });
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
