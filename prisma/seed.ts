import fs from "node:fs";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Set up categories

  // Set up documents
  const documents = fs.readdirSync("public/pdfs");

  documents.map(async (document) => {
    await prisma.document.create({
      data: {
        title: document,
        slug: document.toLowerCase().replace(/ /g, "-"),
      },
    });
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (_) => {
    // console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
