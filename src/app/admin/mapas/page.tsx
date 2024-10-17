import BookMapList from "@/components/map-list";
import MapTable from "@/components/mapbook-table";
import { getBookMaps } from "@/lib/db/bookmaps";
import { getShelves } from "@/lib/db/shelves";

export const dynamic = 'force-dynamic'

export default async function BookMapsPage() {
  const bookMaps = await getBookMaps()
  const shelves = await getShelves()
  return (
    <div className="p-4 flex flex-col gap-4 self-stretch grow">
      <MapTable maps={bookMaps}/>
    </div>
  )
}
