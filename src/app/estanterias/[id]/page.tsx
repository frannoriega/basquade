import Gallery from "@/components/gallery"
import { BookPreview } from "@/data/book-preview"
import { getBooksByShelf } from "@/lib/db/books"
import { getShelf } from "@/lib/db/shelves";
import { notFound } from "next/navigation"

export default async function Page({ params }: { params: { id: number } }) {
  const shelf = await getShelf(Number(params.id));
  if (!shelf) {
    notFound()
  }
  const books = await getBooksByShelf(Number(params.id))

  const previews = books.map((b) => new BookPreview(b.id, b.title, b.authors.map((a) => `${a.author.name} ${a.author.surname} (${a.author.email})`), b.description, b.cover))
  return (
    <div className="pt-24 flex flex-col gap-4 w-full container mx-auto">
      <h1 className="font-black text-2xl">{shelf.name}</h1>
      <Gallery books={previews} />
    </div>
  )
}
