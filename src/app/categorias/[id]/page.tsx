import { getBooks } from "@/lib/db/books"
import { notFound } from "next/navigation"

export default async function Page({ params }: { params: { id: number } }) {
  const books = await getBooks(Number(params.id))
  if (books == null) {
    notFound()
  }
  return (
    <div>
      {books.map((b, _) =>
        <span>{b.title}</span>
      )}
    </div>
  )
}
