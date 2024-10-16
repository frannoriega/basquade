import { DataTable } from "@/components/data-table";
import ProcessingTable from "@/components/processing-table";
import { getProcessing } from "@/lib/db/processing";
import { ArrowUpDown, CloudCog, ListTodo } from "lucide-react";

export const dynamic = 'force-dynamic'

export default async function ProcessingPage() {
  const books = (await getProcessing()).map(b => {
    return {
      id: b.id,
      title: b.title,
      description: b.description,
    }
  })
  return (
    <div className="p-4 flex flex-col gap-4 self-stretch grow">
      <div className="flex flex-row gap-4">
        <CloudCog className="h-10 self-end" />
        <h1 className="text-3xl font-semibold">En cola de procesamiento</h1>
      </div>
      <ProcessingTable books={books} />
    </div>
  )
}
