import PendingPanel from "@/components/pending-panel";
import { getAuthors } from "@/lib/db/authors";
import { getPendingById } from "@/lib/db/books";
import { getCategories } from "@/lib/db/categories";
import { getLanguages } from "@/lib/db/languages";

export default async function PendingBookPage({ params }: { params: { id: number } }) {
  const book = await getPendingById(Number(params.id))
  if (!book) {
    return <div>No books</div>
  }
  const strippedBook = {
    id: book.id,
    title: book.title,
    description: book.description,
    authors: book.authors.map((a) => a.author),
    lang: book.lang,
    category: book.category
  }
  const languages = await getLanguages()
  const authors = await getAuthors()
  const categories = await getCategories()
  return (
    <PendingPanel book={strippedBook} languages={languages} authors={authors} categories={categories} />
  )
}
