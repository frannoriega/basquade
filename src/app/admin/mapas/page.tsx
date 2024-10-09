import BookMapList from "@/components/map-list";
import { getBookMaps } from "@/lib/db/bookmaps";
import { getShelves } from "@/lib/db/shelves";

export const dynamic = 'force-dynamic'

export default async function BookMapsPage() {
  const bookMaps = (await getBookMaps()).map((c) => {
    return {
      id: c.id,
      name: c.name,
      description: c.description,
      books: c._count.books
    }
  })
  const shelves = await getShelves()
  return <BookMapList bookMaps={bookMaps} shelves={shelves}/>
}
