import BookList from "@/components/book-list";
import { getAuthors } from "@/lib/db/authors";
import { getBooks } from "@/lib/db/books";
import { getShelves } from "@/lib/db/shelves";
import { getLanguages } from "@/lib/db/languages";

export const dynamic = 'force-dynamic'

export default async function BooksPage() {
  const books = await getBooks()
  const languages = await getLanguages()
  const shelves = await getShelves()
  const authors = await getAuthors()
  return (
    <BookList books={books} languages={languages} shelves={shelves} authors={authors}/>
  )
}
