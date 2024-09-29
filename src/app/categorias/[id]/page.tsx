import Gallery from "@/components/gallery"
import { BookPreview } from "@/data/book-preview"
import { getBooks } from "@/lib/db/books"
import { getCategory } from "@/lib/db/categories";
import { notFound } from "next/navigation"

export default async function Page({ params }: { params: { id: number } }) {
  const category = await getCategory(Number(params.id));
  if (!category) {
    notFound()
  }
  const books = await getBooks(Number(params.id))

  const previews = books.map((b) => new BookPreview(b.id, b.title, b.authors.map((a) => `${a.author.name} ${a.author.surname} (${a.author.email})`), b.description, b.cover))
  return (
    <div className="pt-24 flex flex-col gap-4 w-full">
      <h1 className="font-black text-2xl">{category.name}</h1>
      <Gallery books={previews} />
    </div>
  )
}
