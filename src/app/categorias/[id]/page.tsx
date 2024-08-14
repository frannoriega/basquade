import { getBooks } from "@/lib/db/books"
import { getUsedCategories } from "@/lib/db/categories"

export const dynamicParams = false;

export async function generateStaticParams() {
  const cats = await getUsedCategories();
  return cats.map((cat) => ({
    id: cat.id.toString()
  }))
}

export default async function Page({ params }: { params: { id: number } }) {
  const books = await getBooks(Number(params.id))
  return (
    <div>
      {books.map((b, _) =>
        <span>{b.title}</span>
      )}
    </div>
  )
}
