import { PrismaClient } from '@prisma/client'
import * as fs from "fs";
import * as crypto from 'crypto'

const prisma = new PrismaClient()
async function main() {
  // Creamos los lenguajes
  const spanish = await prisma.lang.upsert({
    where: { language: 'spanish' },
    update: {},
    create: {
      language: 'spanish',
    },
  })

  const english = await prisma.lang.upsert({
    where: { language: 'english' },
    update: {},
    create: {
      language: 'english',
    },
  })

  const portuguese = await prisma.lang.upsert({
    where: { language: 'portuguese' },
    update: {},
    create: {
      language: 'portuguese',
    },
  })

  // Creamos las categorias
  const agro_icon = fs.readFileSync('prisma/data/icons/agroecologia.svg', null);
  const agroecologia = await prisma.category.upsert({
    where: { name: 'Agroecología' },
    update: {},
    create: {
      name: 'Agroecología',
      icon: agro_icon
    },
  })

  const sentences_icon = fs.readFileSync('prisma/data/icons/sentencias.svg', null);
  const sentencias = await prisma.category.upsert({
    where: { name: 'Sentencias' },
    update: {},
    create: {
      name: 'Sentencias',
      icon: sentences_icon
    },
  })

  const research_icon = fs.readFileSync('prisma/data/icons/investigacion.svg', null);
  const investigacion = await prisma.category.upsert({
    where: { name: 'Trabajos de investigación' },
    update: {},
    create: {
      name: 'Trabajos de investigación',
      icon: research_icon
    },
  })

  const categories = [
    agroecologia,
    sentencias,
    investigacion
  ]

  // Creamos algunas instituciones
  const unl = await prisma.institution.upsert({
    where: { name: 'Universidad Nacional del Litoral' },
    update: {},
    create: {
      name: 'Universidad Nacional del Litoral',
    }
  })

  const unlp = await prisma.institution.upsert({
    where: { name: 'Universidad Nacional de La Plata' },
    update: {},
    create: {
      name: 'Universidad Nacional de La Plata',
    }
  })

  // Creamos algunos libros
  let books = []
  for (let i = 0; i < 9; i++) {
    const book_bytes = fs.readFileSync(`prisma/data/books/book${i + 1}.pdf`, null)
    const book_content = fs.readFileSync(`prisma/data/books/book${i + 1}.content`, 'utf8')
    const book_hash = crypto.createHash('md5').update(book_bytes).digest('hex')
    await prisma.$executeRaw`INSERT INTO "Book"
("id", "title", "file", "content", "md5", "langId", "categoryId", "pending")
VALUES (${i+1}, 'Book ${i + 1}', ${book_bytes}, to_tsvector('spanish', ${book_content}), ${book_hash}, ${spanish.id}, ${categories[i % 3].id}, ${i % 2 == 0}) ON CONFLICT DO NOTHING;`
    books.push(i+1)
  }

  // Creamos algunos autores
  const fran = await prisma.author.upsert({
    where: {
      email: 'fran@example.com'
    },
    update: {},
    create: {
      name: 'Francisco',
      surname: 'Noriega',
      email: 'fran@example.com'
    }
  })

  const diego = await prisma.author.upsert({
    where: {
      email: 'diego@example.com'
    },
    update: {},
    create: {
      name: 'Diego',
      surname: 'Arrigo',
      email: 'diego@example.com'
    }
  })

  const authors = [
    fran,
    diego
  ]

  // Creamos algunas relaciones entre autores y libros
  await prisma.authorOnBook.deleteMany({})
  for (let i = 0; i < books.length; i++) {
    await prisma.authorOnBook.create({
      data: {
        book: {
          connect: {
            id: books[i]
          }
        },
        author: {
          connect: {
            id: authors[i % 2].id
          }
        },

      }
    })
    await prisma.authorOnBook.create({
      data: {
        book: {
          connect: {
            id: books[i]
          }
        },
        author: {
          connect: {
            id: authors[0].id
          }
        },

      }
    })
  }

  // Creamos algunas relaciones entre autores e instituciones
  await prisma.authorOnInstitution.deleteMany()
  await prisma.authorOnInstitution.create({
    data: {
      authorId: fran.id,
      instId: unl.id
    }
  })

  await prisma.authorOnInstitution.create({
    data: {
      authorId: diego.id,
      instId: unl.id
    }
  })

  await prisma.authorOnInstitution.create({
    data: {
      authorId: diego.id,
      instId: unlp.id
    }
  })

  // Creamos algunos casos
  const cases = []
  for (let i = 0; i < 3; i++) {
    cases.push(await prisma.case.upsert({
      where: { name: `Caso ${i+1}` },
      update: {},
      create: {
        name: `Caso ${i+1}`,
      }
    }))
  }

  // Agregamos unas relaciones entre libros
  for (let i = 0; i < books.length - 1; i++) {
    await prisma.caseOnBook.create({
      data: {
        startId: books[i],
        endId: books[i + 1],
        description: `Prueba ${i+1}-${i+2}`,
        caseId: cases[0].id
      }
    })
  }

  for (let i = 3; i < books.length - 1; i++) {
    await prisma.caseOnBook.create({
      data: {
        startId: books[i],
        endId: books[i + 1],
        description: `Prueba ${i+1}-${i+2}`,
        caseId: cases[1].id
      }
    })
  }
  await prisma.caseOnBook.create({
      data: {
        startId: books[3],
        endId: books[7],
        description: `Prueba 4-8`,
        caseId: cases[1].id
      }
  })
  await prisma.caseOnBook.create({
      data: {
        startId: books[0],
        endId: books[3],
        description: `Prueba 1-4`,
        caseId: cases[2].id
      }
  })
  await prisma.caseOnBook.create({
      data: {
        startId: books[0],
        endId: books[7],
        description: `Prueba 1-8`,
        caseId: cases[2].id
      }
  })
  await prisma.caseOnBook.create({
      data: {
        startId: books[7],
        endId: books[8],
        description: `Prueba 8-9`,
        caseId: cases[2].id
      }
  })

  // Agregamos algunas relaciones caso a caso
  await prisma.caseOnCase.create({
    data: {
      startId: cases[0].id,
      endId: cases[1].id,
      description: "Relacion"
    }
  })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
