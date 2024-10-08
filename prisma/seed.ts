import { PrismaClient } from '@prisma/client'
import * as fs from "fs";
import * as crypto from 'crypto'

const prisma = new PrismaClient()
async function main() {
  // Creamos los lenguajes
  const spanish = await prisma.lang.upsert({
    where: { pg_lang: 'spanish' },
    update: {},
    create: {
      pg_lang: 'spanish',
      tesseract: 'spa',
      display: 'Español'
    },
  })

  await prisma.lang.upsert({
    where: { pg_lang: 'english' },
    update: {},
    create: {
      pg_lang: 'english',
      tesseract: 'eng',
      display: 'Inglés'
    }
  })

  await prisma.lang.upsert({
    where: { pg_lang: 'portuguese' },
    update: {},
    create: {
      pg_lang: 'portuguese',
      tesseract: 'por',
      display: 'Portugués'
    },
  })

  // Creamos las categorias
  const agro_icon = fs.readFileSync('prisma/data/icons/agroecologia.svg', null);
  const agroecologia = await prisma.shelf.upsert({
    where: { name: 'Agroecología' },
    update: {},
    create: {
      name: 'Agroecología',
      description: 'Libros, manuales y proyectos orientados a desarrollar el modelo agroecológico',
      icon: agro_icon
    },
  })

  const sentences_icon = fs.readFileSync('prisma/data/icons/sentencias.svg', null);
  const sentencias = await prisma.shelf.upsert({
    where: { name: 'Sentencias' },
    update: {},
    create: {
      name: 'Sentencias',
      description: 'Documentos sobre sentencias judiciales en casos relacionados al medio ambiente',
      icon: sentences_icon
    },
  })

  const research_icon = fs.readFileSync('prisma/data/icons/investigacion.svg', null);
  const investigacion = await prisma.shelf.upsert({
    where: { name: 'Trabajos de investigación' },
    update: {},
    create: {
      name: 'Trabajos de investigación',
      description: 'Documentos, tesis y papers sobre investigaciones relacionadas al medio ambiente',
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
  for (let i = 0; i < 6; i++) {
    const book_num = i + 1
    const book_bytes = fs.readFileSync(`prisma/data/books/book${i + 1}.pdf`, null)
    const book_content = fs.readFileSync(`prisma/data/books/book${i + 1}.content`, 'utf8')
    const book_cover = fs.readFileSync(`prisma/data/books/book${i+1}.png`)
    const book_hash = crypto.createHash('md5').update(book_bytes).digest('hex')
    const book_name = `Book ${book_num}`
    const book_desc = `Description ${book_num}`
    await prisma.$executeRaw`INSERT INTO "Book"
("id", "title", "description", "file", "content", "cover", "md5", "langId", "shelfId", "needs_revision")
VALUES (${book_num}, ${book_name}, ${book_desc}, ${book_bytes}, to_tsvector('spanish', ${book_content}), ${book_cover}, ${book_hash}, ${spanish.id}, ${categories[i % 3].id}, ${i % 2 == 0}) ON CONFLICT DO NOTHING;`
    books.push(book_num)
  }

  // Creamos algunos pendientes
  let pending = []
  for (let i = 6; i < 9; i++) {
    const book_num = i + 1
    const book_bytes = fs.readFileSync(`prisma/data/books/book${i + 1}.pdf`, null)
    const book_hash = crypto.createHash('md5').update(book_bytes).digest('hex')
    const book_name = `Book ${book_num}`
    const book_desc = `Description ${book_num}`
    pending.push(await prisma.pending.create({
      data: {
        title: book_name,
        description: book_desc,
        file: book_bytes,
        md5: book_hash,
        langId: spanish.id,
        shelfId: categories[i % 3].id
      }
    }))
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
  }

  await prisma.authorOnPending.deleteMany({})
  for (let i = 0; i < pending.length; i++) {
    await prisma.authorOnPending.create({
      data: {
        pending: {
          connect: {
            id: pending[i].id
          }
        },
        author: {
          connect: {
            id: authors[i % 2].id
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
  const maps = []
  for (let i = 0; i < 3; i++) {
    maps.push(await prisma.bookMap.upsert({
      where: { name: `Caso ${i+1}` },
      update: {},
      create: {
        name: `Caso ${i+1}`,
        description: `Descripción ${i + 1}`,
        shelfId: agroecologia.id
      }
    }))
  }

  // Agregamos unas relaciones entre libros
  for (let i = 0; i < books.length - 1; i++) {
    await prisma.bookMapRelation.create({
      data: {
        startId: books[i],
        endId: books[i + 1],
        description: `Prueba ${i+1}-${i+2}`,
        mapId: maps[0].id
      }
    })
  }

  for (let i = 3; i < books.length - 1; i++) {
    await prisma.bookMapRelation.create({
      data: {
        startId: books[i],
        endId: books[i + 1],
        description: `Prueba ${i+1}-${i+2}`,
        mapId: maps[1].id
      }
    })
  }
  await prisma.bookMapRelation.create({
      data: {
        startId: books[3],
        endId: books[5],
        description: `Prueba 4-6`,
        mapId: maps[1].id
      }
  })
  await prisma.bookMapRelation.create({
      data: {
        startId: books[0],
        endId: books[3],
        description: `Prueba 1-4`,
        mapId: maps[2].id
      }
  })
  await prisma.bookMapRelation.create({
      data: {
        startId: books[0],
        endId: books[5],
        description: `Prueba 1-6`,
        mapId: maps[2].id
      }
  })

  // Agregamos algunas relaciones caso a caso
  await prisma.atlasRelation.create({
    data: {
      startId: maps[0].id,
      endId: maps[1].id,
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
