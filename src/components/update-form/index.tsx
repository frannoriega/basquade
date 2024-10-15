'use client'
import { Button } from "../ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { BookInfo, BookUpdate } from "@/types/books"
import { Author } from "@prisma/client"
import { z } from "zod"
import { MultiSelect } from "../ui/multiselect"
import { updateBook } from "@/lib/db/books"
import { useRouter } from "next/navigation"

type UpdateFormParams = {
  book: BookInfo,
  languages: {
    id: number,
    display: string,
  }[],
  shelves: {
    id: number,
    name: string
  }[],
  authors: Author[],
  onSubmit?: () => void
}

const UpdateBookSchema = z.object({
  title: z.string().min(5, {
    message: "Ingresa al menos 5 caracteres"
  }),
  description: z.string().min(20, {
    message: "Ingresa al menos 20 caracteres"
  }),
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

export default function UpdateForm({ book, languages, shelves, authors, onSubmit }: UpdateFormParams) {
  const router = useRouter()
  const form = useForm<z.infer<typeof UpdateBookSchema>>({
    resolver: zodResolver(UpdateBookSchema),
    defaultValues: {
      title: book.title,
      description: book.description,
      lang: {
        id: book.lang.id,
        display: book.lang.display
      },
      shelf: {
        id: book.shelf.id,
        name: book.shelf.name
      },
      authors: book.authors.map(a => {
        return {
          id: a.id,
          text: `${a.name} ${a.surname} (${a.email})`
        }
      })
    }
  })

const authorOptions = authors.map((a) => {
  return { id: a.id, text: `${a.name} ${a.surname} (${a.email})` }
})

async function submitBook(values: z.infer<typeof UpdateBookSchema>) {
  const bookUpdate: BookUpdate = {
    id: book.id,
    title: values.title,
    description: values.description,
    lang: values.lang.id,
    shelf: values.shelf.id,
    authors: values.authors.map(a => a.id)
  }
  await updateBook(bookUpdate)
  if (onSubmit) {
    onSubmit()
  }
  router.refresh()
}

return (
  <Form {...form}>
    <form onSubmit={form.handleSubmit(submitBook)} className="flex flex-col gap-8">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem className="flex flex-col gap-2">
            <FormLabel>Título</FormLabel>
            <FormControl>
              <input {...field} value={field.value ?? ''} type="text" required className="rounded-sm" />
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
              <input {...field} value={field.value ?? ''} type="text" required className="rounded-sm" />
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
              <Select defaultValue={field.value?.id.toString() ?? book.lang.id} onValueChange={(id) => field.onChange(languages.find((l) => l.id == Number(id)))}>
                <SelectTrigger className="flex flex-row gap-4 bg-gray-700 items-center justify-between p-4 min-h-fit rounded text-sm" aria-label="Lenguaje">
                  <SelectValue placeholder={field.value?.display ?? book.lang.display} />
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
              <Select defaultValue={field.value?.id.toString() ?? book.shelf.id} onValueChange={(id) => field.onChange(shelves.find((c) => c.id == Number(id)))}>
                <SelectTrigger className="flex flex-row gap-4 bg-gray-700 items-center justify-between p-4 min-h-fit rounded text-sm" aria-label="Lenguaje">
                  <SelectValue placeholder={field.value?.name ?? book.shelf.name} />
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
          <FormItem className="flex flex-col gap-2">
            <FormLabel>Autores</FormLabel>
            <FormControl>
              <MultiSelect
                defaultValue={field.value?.map((v) => v.id.toString()) ?? book.authors.map(a => a.id.toString())}
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
      <Button type='submit'>Guardar</Button>
    </form>
  </Form>
)
}
