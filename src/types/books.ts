import { Prisma } from "@prisma/client"
import { type } from "os"

type BookWithAll = Prisma.BookGetPayload<{
  select: { id: true, title: true, description: true, authors: { select: { author: true } }, lang: true, category: { select: { id: true, name: true } } }
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
}

type BookUpdate = {
  id: number,
  title: string,
  description: string,
  lang: number,
  category: number,
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
  categoryId: number,
  authors: number[]
}

export type { BookWithAll, BookWithDisplayAuthor, BookWithAuthor, BookInfo, BookUpdate, CreateBook }
