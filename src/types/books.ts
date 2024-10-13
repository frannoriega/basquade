import { Author, Prisma } from "@prisma/client"

type BookWithAll = Prisma.BookGetPayload<{
  select: { id: true, title: true, description: true, authors: { select: { author: true } }, lang: true, shelf: { select: { id: true, name: true } } }
}>

type BookWithDisplayAuthor = {
  id: number,
  title: string,
  description: string,
  cover: Buffer,
  authors: string[]
}

type BookWithAuthor = Prisma.BookGetPayload<{
  include: { authors: { include: { author: true } } }
}>

type BookInfo = {
  id: number,
  title: string,
  description: string
  authors: Author[]
}

type BookUpdate = {
  id: number,
  title: string,
  description: string,
  lang: number,
  shelf: number,
  authors: number[]
}

type CreateBook = {
  title: string,
  description: string,
  file: number[],
  lang: {
    id: number,
    language: string
  },
  shelfId: number,
  authors: number[]
}

export type { BookWithAll, BookWithDisplayAuthor, BookWithAuthor, BookInfo, BookUpdate, CreateBook }
