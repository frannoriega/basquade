import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { BookInfo, BookUpdate } from "@/types/books";
import { ColumnDef, ColumnDefTemplate, HeaderContext } from "@tanstack/react-table";
import { ArrowUpDown, EyeIcon, Pencil } from "lucide-react";
import Link from "next/link";
import UpdateForm from "@/components/update-form";
import { Author } from "@prisma/client";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useState } from "react";
import Actions from "../actions";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multiselect";
import { updateBook } from "@/lib/db/books";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

type Language = {
  id: number,
  pg_lang: string,
  tesseract: string,
  display: string
}

type Shelf = {
  id: number,
  name: string
}

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

export function columns(formId: string, languages: Language[], shelves: Shelf[], authors: Author[]): ColumnDef<BookInfo>[] {
  return [
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
      accessorKey: 'title',
      header: getHeaderFunc('Título'),
    },
    {
      accessorKey: 'description',
      header: getHeaderFunc('Descripción'),
    },
    {
      accessorKey: 'authors',
      header: getHeaderFunc('Autores'),
      cell: ({ cell }) => (
        <div className="flex flex-col gap-2">
          { cell.getValue<Author[]>().map(a => <span>{a.name} {a.surname} ({a.email})</span>) }
        </div>
      )
    },
    {
      id: 'Acciones',
      accessorKey: 'id',
      header: getHeaderFunc('Acciones'),
      cell: ({ row }) => (
        <div className="flex flex-row gap-4">
          <Link href={`/api/pdf/${row.original.id}`} className={buttonVariants({ variant: 'ghost' })}><EyeIcon /></Link>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant='ghost'><Pencil /></Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="p-4 text-center">Editando documento "{row.original.title}"</DialogTitle>
                <VisuallyHidden>
                  <DialogDescription>Pantalla para editar el documento {row.original.title}</DialogDescription>
                </VisuallyHidden>
              </DialogHeader>
              <UpdateForm book={row.original} languages={languages} shelves={shelves} authors={authors} />
            </DialogContent>
          </Dialog>
        </div>
      )
    }
  ]
}
