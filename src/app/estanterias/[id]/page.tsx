import { columns } from "@/components/book-table/static";
import { DataTable } from "@/components/data-table";
import { getBooksByShelf } from "@/lib/db/books"
import { getShelf } from "@/lib/db/shelves";
import { notFound } from "next/navigation"

export default async function Page({ params }: { params: { id: number } }) {
  const shelf = await getShelf(Number(params.id));
  if (!shelf) {
    notFound()
  }
  const books = await getBooksByShelf(Number(params.id))

  const previews = books.map((b) => {
    return {
      id: b.id,
      title: b.title,
      description: b.description,
      authors: b.authors.map((a) => `${a.author.name} ${a.author.surname} (${a.author.email})`),
    }
  })
  return (
    <div className="py-12 flex flex-col gap-4 w-full container mx-auto">
      <h1 className="font-black text-4xl text-center">{shelf.name}</h1>
      <DataTable
        columns={columns}
        data={previews}
        filterBy="Título"
      />
    </div>
  )
}
