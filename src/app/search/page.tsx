import Gallery from "@/components/gallery";
import { BookPreview } from "@/data/book-preview";
import { searchBooks, searchBooksFromCategory } from "@/lib/db/books";
import { redirect } from "next/navigation";

type SearchParams = {
  term: string,
  filter?: string
}

export default async function Search({ searchParams }: { searchParams: SearchParams }) {
  const { term, filter } = searchParams;

  if (!term || term.length == 0) {
    redirect("/")
  }

  const books = filter ? await searchBooksFromCategory(term, filter) : await searchBooks(term)

  const previews = books.map((b) => new BookPreview(b.id, b.title, b.authors, b.description))
  return (
    <div className="pt-24 flex flex-col gap-4 w-full">
      <h1 className="font-black text-2xl">Mostrando resultados para "{term}"</h1>
      <Gallery books={previews}/>
    </div>
  )
}
