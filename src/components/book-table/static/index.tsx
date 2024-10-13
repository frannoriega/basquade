
"use client"
import { Button, buttonVariants } from "@/components/ui/button";
import { BookPreview } from "@/data/book-preview";
import { ColumnDef, ColumnDefTemplate, HeaderContext } from "@tanstack/react-table";
import { ArrowUpDown, Eye } from "lucide-react";
import Link from "next/link";

function getHeaderFunc(label: string): ColumnDefTemplate<HeaderContext<BookPreview, unknown>> {
  return ({ column }: HeaderContext<BookPreview, unknown>) => (
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

export const columns: ColumnDef<BookPreview>[] = [
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
    header: getHeaderFunc('Autores')
  },
  {
    id: 'Acciones',
    accessorKey: 'id',
    header: getHeaderFunc('Acciones'),
    cell: ({ cell }) => <Link href={`/api/pdf/${cell.getValue()}`} className={buttonVariants({ variant: 'ghost' })}><Eye /></Link>
  }
]
