import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { BookInfo } from "@/types/books";
import { ColumnDef, ColumnDefTemplate, HeaderContext } from "@tanstack/react-table";
import { ArrowUpDown, EyeIcon, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import UpdateForm from "@/components/update-form";
import { Author } from "@prisma/client";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { deleteBooks } from "@/lib/db/books";
import { useRouter } from "next/navigation";
import { getHeaderFunc, getSelectableColumn } from "@/lib/table";

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

export function columns(languages: Language[], shelves: Shelf[], authors: Author[]): ColumnDef<BookInfo>[] {
  return [
    getSelectableColumn("select"),
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
      accessorKey: 'id',
      header: 'Acciones',
      enableSorting: false,
      cell: ({ row }) => {
        const router = useRouter()
        async function remove(id: number) {
          await deleteBooks([id])
          router.refresh()
        }
        return (
        <div className="flex flex-row gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/api/pdf/${row.original.id}`} className={buttonVariants({ variant: 'ghost' })}><EyeIcon /></Link>
              </TooltipTrigger>
              <TooltipContent>
                Abrir libro
              </TooltipContent>
            </Tooltip>
            <Dialog>
              <DialogTrigger asChild>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant='ghost'><Pencil /></Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Editar libro
                  </TooltipContent>
                </Tooltip>
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
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='ghost' onClick={() => remove(row.original.id)}><Trash2 /></Button>
              </TooltipTrigger>
              <TooltipContent>
                Borrar libro
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ) }
    }
  ]
}
