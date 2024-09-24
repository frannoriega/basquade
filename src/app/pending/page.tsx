import { getPendingId } from "@/lib/db/books"

export default async function PendingPage() {
  // const book = await getPendingId();
  const book = 1;
  if (!book) {
    return <div>No books</div>
  }
  return (
    <div className="grid grid-cols-3 w-full">
      <iframe className="col-span-2 w-full h-full" src={ `/api/pdf/${book}` }></iframe>
      <div className="bg-red-200"></div>
    </div>
  )
}
