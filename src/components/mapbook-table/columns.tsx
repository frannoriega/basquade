import { getHeaderFunc, getSelectableColumn } from "@/lib/table";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Pencil, Trash2 } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export const columns: ColumnDef<BookMap>[] = [
  getSelectableColumn('select'),
  {
    accessorKey: 'name',
    header: getHeaderFunc('Nombre'),
    meta: {
      name: 'Nombre'
    }
  },
  {
    accessorKey: 'description',
    header: getHeaderFunc('Descripción'),
    meta: {
      name: 'Descripción'
    }
  },
  {
    accessorKey: 'book_count',
    header: getHeaderFunc('Libros'),
    meta: {
      name: 'Libros'
    }
  },
  {
    accessorKey: 'id',
    header: 'Acciones',
    enableSorting: false,
    cell: ({ row }) => {
      const router = useRouter()
      async function remove(id: number) {
        router.refresh()
      }
      return (
        <div className="flex flex-row gap-4">
          <TooltipProvider>
            <Dialog>
              <DialogTrigger asChild>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href={`/admin/mapas/${row.original.id}`} className={buttonVariants({ variant: 'ghost' })}><Pencil /></Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    Editar mapa
                  </TooltipContent>
                </Tooltip>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="p-4 text-center">Editando mapa "{row.original.name}"</DialogTitle>
                  <VisuallyHidden>
                    <DialogDescription>Pantalla para editar el documento {row.original.name}</DialogDescription>
                  </VisuallyHidden>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='ghost' onClick={() => remove(row.original.id)}><Trash2 /></Button>
              </TooltipTrigger>
              <TooltipContent>
                Borrar mapa
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )
    }
  }
]
