import { getAuthors } from "@/lib/db/authors";
import { getBooks } from "@/lib/db/books";
import { getShelves } from "@/lib/db/shelves";
import { getLanguages } from "@/lib/db/languages";
import BookTable from "@/components/book-table";
import { BookText } from "lucide-react";

export const dynamic = 'force-dynamic'

export default async function BooksPage() {
  const books = await getBooks()
  const languages = await getLanguages()
  const shelves = await getShelves()
  const authors = await getAuthors()
  return (
    <div className="p-4 flex flex-col gap-4 self-stretch grow">
      <div className="flex flex-row gap-4">
        <BookText className="h-10 self-end" />
        <h1 className="text-3xl font-semibold">Libros</h1>
      </div>
      <BookTable formId={'book-form'} books={books} languages={languages} shelves={shelves} authors={authors} />
    </div>
  )
}
