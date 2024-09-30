import BookList from "@/components/book-list";
import { getBooks } from "@/lib/db/books";

export default async function BooksPage() {
  const books = await getBooks()
  return (
    <BookList books={books} />
  )
}
