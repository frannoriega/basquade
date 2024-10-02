'use client'
import { useForm } from "react-hook-form";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createBook } from "@/lib/db/books";
import React from "react";
import * as Toast from "@radix-ui/react-toast";

type BookListParams = {
  books: {
    id: number,
    title: string,
    description: string
  }[],
  languages: {
    id: number,
    language: string,
    display: string
  }[],
  categories: {
    id: number,
    name: string
  }[]
}

const createBookSchema = z.object({
  title: z.string(), //.min(5),
  description: z.string(), //.min(20),
  file: z.instanceof(File),
  lang: z.object({
    id: z.number(),
    language: z.string(),
    display: z.string()
  }),
  category: z.object({
    id: z.number(),
    name: z.string()
  })
})

export default function BookList({ books, languages, categories }: BookListParams) {
  const addBook = useForm<z.infer<typeof createBookSchema>>({
    resolver: zodResolver(createBookSchema),
    defaultValues: {
      title: '',
      description: '',
      lang: languages[0],
      category: categories[0],
      file: new File([], "")
    }
  })

  const [open, setOpen] = React.useState(false);
  const [msg, setMsg] = React.useState("Guardado!");
  const timerRef = React.useRef(0);

  React.useEffect(() => {
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
      categoryId: values.category.id
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
  return (
    <div className="p-4 flex flex-col gap-4 h-full">
      <h1>Pendientes</h1>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {books.map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.description}</td>
              <td>
                <Button>Editar</Button>
                <Button variant="destructive">Borrar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="w-full flex flex-row-reverse gap-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="">Agregar</Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-700">
            <DialogHeader>
              <DialogTitle>Agregar nuevo administrador</DialogTitle>
              <VisuallyHidden>
                <DialogDescription>Formulario para agregar a un nuevo administrador</DialogDescription>
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
                          <SelectTrigger className="flex flex-row gap-4 bg-slate-700 items-center justify-between p-4 min-h-fit rounded text-sm" aria-label="Lenguaje">
                            <SelectValue placeholder={field.value.display} />
                          </SelectTrigger>
                          <SelectContent className="">
                            {languages.map(l =>
                              <SelectItem key={l.id} value={l.id.toString()} className='hover:bg-green-600'>
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
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select defaultValue={field.value.id.toString()} onValueChange={(id) => field.onChange(categories.find((c) => c.id == Number(id)))}>
                          <SelectTrigger className="flex flex-row gap-4 bg-slate-700 items-center justify-between p-4 min-h-fit rounded text-sm" aria-label="Lenguaje">
                            <SelectValue placeholder={field.value.name} />
                          </SelectTrigger>
                          <SelectContent className="">
                            {categories.map(c =>
                              <SelectItem key={c.id} value={c.id.toString()} className='hover:bg-green-600'>
                                {c.name}
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <DialogClose asChild>
                  <Button type="submit">Agregar</Button>
                </DialogClose>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        <Toast.Provider swipeDirection="right">
          <Toast.Root open={open} onOpenChange={setOpen}
            className="p-5 grid grid-cols-2">
            <Toast.Title>{msg}</Toast.Title>
          </Toast.Root>
          <Toast.Viewport className="fixed right-0 bottom-0" />
        </Toast.Provider>
      </div>
    </div >
  )
}