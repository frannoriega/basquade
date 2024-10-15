import { columns } from "@/components/book-table/static";
import { DataTable } from "@/components/data-table";
import { searchBooks } from "@/lib/db/books";
import { redirect } from "next/navigation";

type SearchParams = {
  term: string,
  filter?: number
}

export default async function Search({ searchParams }: { searchParams: SearchParams }) {
  const { term, filter } = searchParams;

  if (!term || term.length == 0) {
    redirect("/")
  }

  const books = await searchBooks(term, filter ? Number(filter) : null)

  const previews = books.map((b) => { return { "id": b.id, "title": b.title, "authors": b.authors, "description": b.description } })
  return (
    <div className="py-12 flex flex-col gap-4 w-full container mx-auto">
      <h1 className="font-black text-2xl">Mostrando resultados para "{term}"</h1>
      <DataTable
        columns={columns}
        data={previews}
        filterBy={ { id: 'title', display: 'Título' } }
      />
    </div>
  )
}
