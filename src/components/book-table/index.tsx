'use client'
import { DataTable } from "@/components/data-table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { BookInfo, BookWithAuthor, CreateBook } from "@/types/books";
import { Author } from "@prisma/client";
import { useState } from "react";
import { deleteBooks } from "@/lib/db/books";
import { useRouter } from "next/navigation";
import { columns } from "./editable";
import AddForm from "../add-form";
import { useToast } from "@/hooks/use-toast";

type BookTableParams = {
  books: BookInfo[],
  languages: {
    id: number,
    pg_lang: string,
    tesseract: string,
    display: string
  }[],
  shelves: {
    id: number,
    name: string
  }[],
  authors: Author[],
  allowCreate?: boolean
}

export default function BookTable({ books, languages, shelves, authors, allowCreate }: BookTableParams) {
  const router = useRouter()
  const { toast } = useToast()

  const [open, setOpen] = useState(false);

  async function removeBooks(ids: number[]) {
    setToDelete([])
    await deleteBooks(ids)
    router.refresh()
  }

  const [toDelete, setToDelete] = useState<number[]>([])

  function afterSubmit(book: CreateBook) {
    setOpen(false)
    router.refresh()
    toast({
      className: "p-4 bg-green-200 dark:bg-green-700",
      description: `Libro '${book.title}' guardado con éxito`
    })
  }

  return (
    <>
      <DataTable
        columns={columns(languages, shelves, authors)}
        data={books}
        filterBy={{ id: 'title', display: 'Título' }}
        getRowId={row => row.id.toString()}
        onSelect={(ids) => {
          const numIds = ids.map((id) => Number(id))
          setToDelete(numIds)
        }}
      />
      <div className="w-full flex flex-row-reverse gap-4">
        { allowCreate &&
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="">Agregar</Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-700">
              <DialogHeader>
                <DialogTitle>Agregar nuevo libro</DialogTitle>
                <VisuallyHidden>
                  <DialogDescription>Formulario para agregar a un nuevo libro</DialogDescription>
                </VisuallyHidden>
              </DialogHeader>
              <AddForm languages={languages} shelves={shelves} authors={authors} afterSubmit={afterSubmit} />
            </DialogContent>
          </Dialog>
        }
        {toDelete.length > 0 &&
          <Button variant="destructive" onClick={() => removeBooks(toDelete)} className="self-start">Borrar ({toDelete.length})</Button>
        }
      </div>
    </>
  )
}
