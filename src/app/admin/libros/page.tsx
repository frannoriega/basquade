import BookList from "@/components/book-list";
import { getAuthors } from "@/lib/db/authors";
import { getBooks } from "@/lib/db/books";
import { getCategories } from "@/lib/db/categories";
import { getLanguages } from "@/lib/db/languages";

export const dynamic = 'force-dynamic'

export default async function BooksPage() {
  const books = await getBooks()
  const languages = await getLanguages()
  const categories = await getCategories()
  const authors = await getAuthors()
  return (
    <BookList books={books} languages={languages} categories={categories} authors={authors}/>
  )
}
