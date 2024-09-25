import PendingPanel from "@/components/pending-panel";
import { getAuthors } from "@/lib/db/authors";
import { getPendingWithAuthor } from "@/lib/db/books";
import { getLanguages } from "@/lib/db/languages";

export default async function PendingPage() {
  const book = await getPendingWithAuthor()
  if (!book) {
    return <div>No books</div>
  }
  const strippedBook = {
    id: book.id,
    title: book.title,
    description: book.description,
    authors: book.authors.map((a) => a.author),
    lang: book.lang,
    categoryId: book.categoryId
  }
  const languages = await getLanguages()
  const authors = await getAuthors()
  console.log(authors)
  return (
      <PendingPanel book={strippedBook} languages={languages} authors={authors}/>
  )
}
