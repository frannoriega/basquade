import BookMapCanvas from "@/components/map-canvas";
import { getBookMapById } from "@/lib/db/bookmaps";
import { notFound } from "next/navigation";

export default async function BookMapPage({ params }: { params: { id: number } }) {
  const bookMap = await getBookMapById(Number(params.id))
  if (!bookMap) {
    notFound()
  }
  return (
      <BookMapCanvas bookMap={bookMap}/>
  )
}
