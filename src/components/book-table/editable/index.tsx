"use client"
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { BookInfo } from "@/types/books";
import { Author } from "@prisma/client";
import { ColumnDef, ColumnDefTemplate, HeaderContext } from "@tanstack/react-table";
import { ArrowUpDown, EyeIcon } from "lucide-react";
import Link from "next/link";

function getHeaderFunc(label: string): ColumnDefTemplate<HeaderContext<BookInfo, unknown>> {
  return ({ column }: HeaderContext<BookInfo, unknown>) => (
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

export const columns: ColumnDef<BookInfo>[] = [
  {
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
  },
  {
    id: 'Título',
    accessorKey: 'title',
    header: getHeaderFunc('Título')
  },
  {
    id: 'Descripción',
    accessorKey: 'description',
    header: getHeaderFunc('Descripción')
  },
  {
    id: 'Autores',
    accessorKey: 'authors',
    header: getHeaderFunc('Autores'),
    cell: ({ cell }) => cell.getValue<Author[]>().map(a => `${a.name} ${a.surname} (${a.email})`).join(", ")
  },
  {
    id: 'Acciones',
    accessorKey: 'id',
    header: getHeaderFunc('Acciones'),
    cell: ({ cell }) => (
      <div className="flex flex-row w-full gap-4">
        <Link href={`/api/pdf/${cell.getValue()}`} className={buttonVariants({ variant: 'ghost' })}><EyeIcon /></Link>
      </div>
    )
  }
]
