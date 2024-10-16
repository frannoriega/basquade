
import { Button } from "@/components/ui/button"
import { ColumnDef, ColumnDefTemplate, HeaderContext } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

export type BookToProcess = {
  id: number,
  title: string,
  description: string
}

function getHeaderFunc(label: string): ColumnDefTemplate<HeaderContext<BookToProcess, unknown>> {
  return ({ column }: HeaderContext<BookToProcess, unknown>) => (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="hover:bg-inherit pl-0"
    >
      {label}
      <ArrowUpDown className="hidden md:block ml-2 h-4 w-4" />
    </Button>
  )
}

export const columns: ColumnDef<BookToProcess>[] = [
  {
    accessorKey: 'title',
    header: getHeaderFunc('Título'),
    meta: {
      name: 'Título'
    }
  },
  {
    accessorKey: 'description',
    header: getHeaderFunc('Descripción'),
    meta: {
      name: 'Descripción'
    }
  }
]
