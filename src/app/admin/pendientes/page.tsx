import BookTable from "@/components/book-table";
import { Button } from "@/components/ui/button";
import { getAuthors } from "@/lib/db/authors";
import { getPending } from "@/lib/db/books";
import { getLanguages } from "@/lib/db/languages";
import { getShelves } from "@/lib/db/shelves";
import { ListTodo } from "lucide-react";

export const dynamic = 'force-dynamic'

export default async function PendingPage() {
  const books = (await getPending()).map(b => {
    return {
      id: b.id,
      title: b.title,
      description: b.description,
      authors: b.authors.map(a => a.author)
    }
  })
  const languages = await getLanguages()
  const shelves = await getShelves()
  const authors = await getAuthors()
  return (
    <div className="p-4 flex flex-col gap-4 self-stretch grow">
      <div className="flex flex-row gap-4">
        <ListTodo className="h-10 self-end" />
        <h1 className="text-3xl font-semibold">Pendientes</h1>
      </div>
      <BookTable books={books} languages={languages} shelves={shelves} authors={authors} />
    </div>
  )
}
