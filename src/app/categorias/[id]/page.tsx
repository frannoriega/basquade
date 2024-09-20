import Gallery from "@/components/gallery"
import { BookPreview } from "@/data/book-preview"
import { getBooks } from "@/lib/db/books"
import { notFound } from "next/navigation"

export default async function Page({ params }: { params: { id: number } }) {
  const books = await getBooks(Number(params.id))
  if (books == null) {
    notFound()
  }

  const previews = books.map((b) => new BookPreview(b.id, b.title, ["fran"], "descripción"))
  return <Gallery books={previews}/>
}
