import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { MultiSelect } from "../ui/multiselect"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Input } from "../ui/input"
import { Author } from "@prisma/client"
import {  CreateBook } from "@/types/books"
import { createBook } from "@/lib/db/books"
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
  afterSubmit?: (book: CreateBook) => void
}

const CreateBookSchema = z.object({
  title: z.string().min(5, {
    message: "Ingrese un título de al menos 5 letras"
  }),
  description: z.string().min(20, {
    message: "Ingrese una descripción detallada, de al menos 20 letras"
  }),
  file: z.instanceof(File)
  .refine((file) => file.size > 0, "Cargue un PDF")
  .refine((file) => file.size < 10 * 1024 * 1024, "El PDF no puede ser mayor a 10MB"),
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

  async function submitBook(values: z.infer<typeof CreateBookSchema>) {
    const book: CreateBook = {
      title: values.title,
      description: values.description,
      file: Buffer.from(await values.file.arrayBuffer()).toJSON().data,
      langId: values.lang.id,
      shelfId: values.shelf.id,
      authors: values.authors.map((a) => a.id)
    }
    await createBook(book)
    if (afterSubmit) {
      afterSubmit(book)
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
                <FormLabel>Descripción</FormLabel>
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
                <FormLabel>Cargar libro</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept='application/pdf'
                    className="h-fit file:p-1 file:bg-gray-700 file:text-gray-200 dark:file:bg-gray-200 dark:file:text-gray-700 file:rounded-md"
                    onChange={(e) => field.onChange(e.target.files && e.target.files[0])} />
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
                <FormLabel>Idioma</FormLabel>
                <FormControl>
                  <Select defaultValue={field.value.id.toString()} onValueChange={(id) => field.onChange(languages.find((l) => l.id == Number(id)))}>
                    <SelectTrigger className="flex flex-row gap-4 items-center justify-between p-4 min-h-fit rounded text-sm" aria-label="Lenguaje">
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
                <FormLabel>Estantería</FormLabel>
                <FormControl>
                  <Select defaultValue={field.value.id.toString()} onValueChange={(id) => field.onChange(shelves.find((c) => c.id == Number(id)))}>
                    <SelectTrigger className="flex flex-row gap-4 items-center justify-between p-4 min-h-fit rounded text-sm" aria-label="Lenguaje">
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
                    placeholder="Selecciona los autores"
                    className="w-full h-fit bg-background hover:bg-background rounded-sm placeholder-white placeholder:text-white" />
                </FormControl>
                <FormMessage className="text-red-300 italic" />
              </FormItem>
            }
          />
          <Button type="submit">Agregar</Button>
        </form>
      </Form>
    </>
  )
}
