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

  return <div>{books.map((b) => <span>{b.title}</span>)}</div>
}
