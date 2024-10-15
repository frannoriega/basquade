'use client'
import { DataTable } from "@/components/data-table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { BookInfo, BookWithAuthor } from "@/types/books";
import { Author } from "@prisma/client";
import { useState } from "react";
import { deleteBooks } from "@/lib/db/books";
import { useRouter } from "next/navigation";
import { columns } from "./editable";
import AddForm from "../add-form";
import * as Toast from "@radix-ui/react-toast"

type BookTableParams = {
  formId: string,
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
  authors: Author[]
}

export default function BookTable({ formId, books, languages, shelves, authors }: BookTableParams) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);

  async function removeBooks(ids: number[]) {
    setToDelete([])
    await deleteBooks(ids)
    router.refresh()
  }

  const [toDelete, setToDelete] = useState<number[]>([])

  function afterSubmit() {
    setOpen(false)
    router.refresh()
    setToastOpen(true)
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
        {toDelete.length > 0 &&
          <Button variant="destructive" onClick={() => removeBooks(toDelete)} className="self-start">Borrar ({toDelete.length})</Button>
        }
        <Toast.Root open={toastOpen} onOpenChange={setToastOpen}>
          <Toast.Description>
            Guardado
          </Toast.Description>
        </Toast.Root>
      </div>
    </>
  )
}
