import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import '@tanstack/react-table' //or vue, svelte, solid, qwik, etc.
import { ColumnDef, ColumnDefTemplate, HeaderContext, RowData } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    name: string
  }
}

function getHeaderFunc<TData>(label: string): ColumnDefTemplate<HeaderContext<TData, unknown>> {
  return ({ column }: HeaderContext<TData, unknown>) => (
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

function getSelectableColumn<TData>(id: string): ColumnDef<TData> {
  return {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Seleccionar todos"
        className="hidden md:block"
      />
    ),
    cell: ({ cell, row }) => {
      if (cell.getValue<boolean>()) {
        return null
      }
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Seleccionar fila"
          className="hidden md:block"
        />
      )
    },
    enableSorting: false,
    enableHiding: false,
  }
}

export { getHeaderFunc, getSelectableColumn }
