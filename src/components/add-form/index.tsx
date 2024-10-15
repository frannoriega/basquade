import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { MultiSelect } from "../ui/multiselect"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Input } from "../ui/input"
import { Author } from "@prisma/client"
import { BookInfo } from "@/types/books"
import { useEffect, useRef, useState } from "react"
import { createBook } from "@/lib/db/books"
import * as Toast from "@radix-ui/react-toast"
import { Button } from "../ui/button"

type AddFormParams = {
  formId?: string,
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
  afterSubmit?: () => void
}

const CreateBookSchema = z.object({
  title: z.string().min(5, {
    message: "Ingrese un título de al menos 5 letras"
  }),
  description: z.string().min(20, {
    message: "Ingrese una descripción detallada, de al menos 20 letras"
  }),
  file: z.instanceof(File),
  lang: z.object({
    id: z.number(),
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

export default function AddForm({ formId, languages, shelves, authors, afterSubmit }: AddFormParams) {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("Guardado!");
  const timerRef = useRef(0);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  async function submitBook(values: z.infer<typeof CreateBookSchema>) {
    const book = {
      title: values.title,
      description: values.description,
      file: Buffer.from(await values.file.arrayBuffer()).toJSON().data,
      langId: values.lang.id,
      shelfId: values.shelf.id,
      authors: values.authors.map((a) => a.id)
    }
    await createBook(book)
    if (afterSubmit) {
      afterSubmit()
    }
  }
  const form = useForm<z.infer<typeof CreateBookSchema>>({
    resolver: zodResolver(CreateBookSchema),
    defaultValues: {
      title: '',
      description: '',
      lang: { id: languages[0].id, display: languages[0].display },
      shelf: shelves[0],
      file: new File([], ""),
      authors: []
    }
  })

  const authorOptions = authors.map((a) => {
    return { id: a.id, text: `${a.name} ${a.surname} (${a.email})` }
  })

  return (
    <>
      <Form {...form}>
        <form id={formId} onSubmit={form.handleSubmit(submitBook)} className="flex flex-col gap-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Título</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage className="text-red-300 italic" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage className="text-red-300 italic" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormControl>
                  <Input type="file" onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)} />
                </FormControl>
                <FormMessage className="text-red-300 italic" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lang"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
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
                <FormMessage className="text-red-300 italic" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="shelf"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
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
                <FormMessage className="text-red-300 italic" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="authors"
            render={({ field }) =>
              <FormItem className="h-fit flex flex-col gap-2">
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
                <FormMessage className="text-red-300 italic" />
              </FormItem>
            }
          />
          <Button type="submit">Agregar</Button>
        </form>
      </Form>
      <Toast.Provider swipeDirection="right">
        <Toast.Root open={open} onOpenChange={setOpen}
          className="p-5 grid grid-cols-2">
          <Toast.Title>{msg}</Toast.Title>
        </Toast.Root>
        <Toast.Viewport className="fixed right-0 bottom-0" />
      </Toast.Provider>
    </>
  )
}
