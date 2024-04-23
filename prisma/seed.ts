import { PrismaClient } from "@prisma/client";
import fs from "fs";
const prisma = new PrismaClient();

async function main() {
  // Set up categories

  const categories = [
    "Trabajos de investigación",
    "Campamentos sanitarios",
    "Leyes y ordenanzas",
    "Sentencias",
    "Agroecología",
    "Noticias y recursos",
  ];

  // categories.map(async (category) => {
  //   await prisma.category.create({
  //     data: {
  //       name: category,
  //       slug: category.toLowerCase().replace(/ /g, "-"),
  //     },
  //   });
  // });

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
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
