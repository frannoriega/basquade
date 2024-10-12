"use client"
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef, ColumnDefTemplate, HeaderContext } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export type Admin = {
  id: number,
  name: string,
  lastname: string,
  email: string,
  dni: number,
  permanent: boolean
}

function getHeaderFunc(label: string): ColumnDefTemplate<HeaderContext<Admin, unknown>> {
  return ({ column }: HeaderContext<Admin, unknown>) => (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  )
}

export const columns: ColumnDef<Admin>[] = [
  {
    id: "select",
    accessorKey: 'permanent',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Seleccionar todos"
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
        />
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: getHeaderFunc('Nombre')
  },
  {
    accessorKey: 'lastname',
    header: getHeaderFunc('Apellido')
  },
  {
    accessorKey: 'email',
    header: getHeaderFunc('Email')
  },
  {
    accessorKey: 'dni',
    header: getHeaderFunc('DNI')
  }
]
