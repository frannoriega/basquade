import CaseCanvas from "@/components/case-canvas";
import { getCaseById } from "@/lib/db/cases";
import { notFound } from "next/navigation";

export default async function CasePage({ params }: { params: { id: number } }) {
  const collection = await getCaseById(Number(params.id))
  if (!collection) {
    notFound()
  }
  return (
      <CaseCanvas collection={collection}/>
  )
}
