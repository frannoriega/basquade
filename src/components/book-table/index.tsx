'use client'
import { DataTable } from "@/components/data-table";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { BookInfo } from "@/types/books";
import { Author } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useMemo, useRef, useState } from "react";
import { createBook, deleteBooks } from "@/lib/db/books";
import { useRouter } from "next/navigation";
import { columns } from "./editable";
import { MultiSelect } from "../ui/multiselect";
import * as Toast from "@radix-ui/react-toast";
import { useForm } from "react-hook-form";

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
  authors: Author[]
}

const removeBookSchema = z.object({
  books: z.array(z.number())
})

const createBookSchema = z.object({
  title: z.string().min(5, {
    message: "Ingrese un título de al menos 5 letras"
  }),
  description: z.string().min(20, {
    message: "Ingrese una descripción detallada, de al menos 20 letras"
  }),
  file: z.instanceof(File),
  lang: z.object({
    id: z.number(),
    language: z.string(),
    display: z.string()
  }),
  shelf: z.object({
    id: z.number(),
    name: z.string()
  }),
  authors: z.array(z.object({ id: z.number(), text: z.string() })).min(1, {
    message: "Ingrese al menos un autor"
  }),
})

export default function BookTable({ books, languages, shelves, authors }: BookTableParams) {
  const router = useRouter();

  const addBook = useForm<z.infer<typeof createBookSchema>>({
    resolver: zodResolver(createBookSchema),
    defaultValues: {
      title: '',
      description: '',
      lang: languages[0],
      shelf: shelves[0],
      file: new File([], ""),
      authors: []
    }
  })

  const removeForm = useForm<z.infer<typeof removeBookSchema>>({
    resolver: zodResolver(removeBookSchema),
    defaultValues: {
      books: []
    },
  })

  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("Guardado!");
  const timerRef = useRef(0);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  async function submitBook(values: z.infer<typeof createBookSchema>) {
    const book = {
      title: values.title,
      description: values.description,
      file: Buffer.from(await values.file.arrayBuffer()).toJSON().data,
      lang: {
        id: values.lang.id,
        language: values.lang.language
      },
      shelfId: values.shelf.id,
      authors: values.authors.map((a) => a.id)
    }
    setMsg("Guardado!")
    const message = await createBook(book)
    setMsg(message)
    setOpen(false);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setOpen(true);
    }, 100);
  }

  const authorOptions = authors.map((a) => {
    return { id: a.id, text: `${a.name} ${a.surname} (${a.email})` }
  })

  async function removeBooks(values: z.infer<typeof removeBookSchema>) {
    setToDelete([])
    if (values.books) {
      await deleteBooks(values.books)
      removeForm.setValue("books", [])
      router.refresh()
    }
  }

  const [toDelete, setToDelete] = useState<number[]>([])

  return (
    <>
      <Form {...removeForm}>
        <form id="remove-books" className="flex flex-col self-stretch grow" onSubmit={removeForm.handleSubmit(removeBooks)}>
          <FormField
            control={removeForm.control}
            name="books"
            render={({ field }) => (
              <FormItem className="flex flex-col self-stretch grow">
                <FormControl>
                  <DataTable
                    columns={columns}
                    data={books}
                    filterBy={{ key: "title", display: "título" }}
                    getRowId={row => row.id.toString()}
                    onSelect={(rows) => {
                      const books = Object.entries(rows).filter(([_, v]) => v).map(([k, _]) => Number(k))
                      field.onChange(books)
                      setToDelete(books)
                    }}
                    hideableColumns
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
      <div className="w-full flex flex-row-reverse gap-4">
        <Dialog>
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
            <Form {...addBook}>
              <form onSubmit={addBook.handleSubmit(submitBook)}>
                <FormField
                  control={addBook.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={addBook.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={addBook.control}
                  name="file"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <input type="file" onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={addBook.control}
                  name="lang"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select defaultValue={field.value.id.toString()} onValueChange={(id) => field.onChange(languages.find((l) => l.id == Number(id)))}>
                          <SelectTrigger className="flex flex-row gap-4 bg-gray-700 items-center justify-between p-4 min-h-fit rounded text-sm" aria-label="Lenguaje">
                            <SelectValue placeholder={field.value.display} />
                          </SelectTrigger>
                          <SelectContent className="">
                            {languages.map(l =>
                              <SelectItem key={l.id} value={l.id.toString()} className='focus:bg-green-600'>
                                {l.display}
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={addBook.control}
                  name="shelf"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select defaultValue={field.value.id.toString()} onValueChange={(id) => field.onChange(shelves.find((c) => c.id == Number(id)))}>
                          <SelectTrigger className="flex flex-row gap-4 bg-gray-700 items-center justify-between p-4 min-h-fit rounded text-sm" aria-label="Lenguaje">
                            <SelectValue placeholder={field.value.name} />
                          </SelectTrigger>
                          <SelectContent className="">
                            {shelves.map(c =>
                              <SelectItem key={c.id} value={c.id.toString()} className='focus:bg-green-600'>
                                {c.name}
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={addBook.control}
                  name="authors"
                  render={({ field }) =>
                    <FormItem className="h-fit">
                      <FormLabel>Autores</FormLabel>
                      <FormControl>
                        <MultiSelect
                          defaultValue={field.value.map((v) => v.id.toString())}
                          onValueChange={(e) => field.onChange(e.map((a) => { return { id: Number(a), text: authorOptions.find((s) => s.id.toString() === a)?.text } }))}
                          options={authorOptions.map((a) => { return { value: a.id.toString(), label: a.text } })}
                          selectAllText="Seleccionar todas"
                          searchText="Buscar..."
                          maxCount={1}
                          placeholder="Selecciona los autores" className="w-full h-fit bg-gray-700 rounded-sm" />
                      </FormControl>
                    </FormItem>
                  }
                />
                <DialogClose asChild>
                  <Button type="submit">Agregar</Button>
                </DialogClose>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        {toDelete.length > 0 ?
          <Button variant="destructive" type="submit" form="remove-books" className="self-start">Borrar ({toDelete.length})</Button>
          : null
        }
        <Toast.Provider swipeDirection="right">
          <Toast.Root open={open} onOpenChange={setOpen}
            className="p-5 grid grid-cols-2">
            <Toast.Title>{msg}</Toast.Title>
          </Toast.Root>
          <Toast.Viewport className="fixed right-0 bottom-0" />
        </Toast.Provider>
      </div>
    </>
  )
}
