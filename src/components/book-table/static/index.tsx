
"use client"
import { Button, buttonVariants } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { BookPreview } from "@/data/book-preview";
import { reportBook } from "@/lib/db/books";
import { getHeaderFunc } from "@/lib/table";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Flag } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const columns: ColumnDef<BookPreview>[] = [
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
  },
  {
    accessorKey: 'authors',
    header: getHeaderFunc('Autores'),
    meta: {
      name: 'Autores'
    }
  },
  {
    accessorKey: 'id',
    header: 'Acciones',
    enableSorting: false,
    meta: {
      name: 'Acciones'
    },
    cell: ({ cell }) => {
      const session = useSession()
      const router = useRouter()
      const bookId = cell.getValue()

      async function report(id: number) {
        await reportBook(id)
        router.refresh()
      }
      return (
        <div className="flex flex-row">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/api/pdf/${bookId}`} className={buttonVariants({ variant: 'ghost' })}><Eye /></Link>
              </TooltipTrigger>
              <TooltipContent>
                Abrir libro
              </TooltipContent>
            </Tooltip>
            {session.data?.user &&
              (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant='ghost' onClick={() => report(Number(bookId))}><Flag /></Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Reportar libro
                  </TooltipContent>
                </Tooltip>
              )}
          </TooltipProvider>
        </div>
      )
    }
  }
]
