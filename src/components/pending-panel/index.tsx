'use client'
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multiselect";
import { zodResolver } from "@hookform/resolvers/zod";
import { Author, Lang } from "@prisma/client";
import * as Toast from "@radix-ui/react-toast";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";

const formSchema = z.object({
  "title": z.string().min(2, {
    message: "Ingrese al menos 2 caracteres"
  }),
  "description": z.string().min(2, {
    message: "Ingrese al menos 2 caracteres"
  }),
  "authors": z.array(z.object({ id: z.number(), text: z.string() })),
  "lang": z.object({ id: z.number(), text: z.string() }),
  "category": z.number()
})

type PendingPanelParams = {
  book: {
    id: number,
    title: string,
    description: string,
    authors: Author[],
    lang: Lang,
    categoryId: number
  },
  languages: Lang[],
  authors: Author[]
}

export default function PendingPanel({ book, languages, authors }: PendingPanelParams) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: book.title,
      description: book.description,
      authors: book.authors.map((a) => { return { id: a.id, text: `${a.name} ${a.surname} (${a.email})` } }),
      lang: {
        id: book.lang.id,
        text: book.lang.language
      },
      category: book.categoryId
    },
  })

  const [open, setOpen] = React.useState(false);
  const timerRef = React.useRef(0);

  React.useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  function onSubmit(values: z.infer<typeof formSchema>) {
    setOpen(false);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setOpen(true);
    }, 100);
  }
  const authorOptions = authors.map((a) => {
    return { id: a.id, text: `${a.name} ${a.surname} (${a.email})` } })
  return (
    <div className="pt-12 pb-12 grid grid-cols-3 grid-rows-1 w-full self-stretch auto-cols-max">
      <iframe className="col-span-2 w-full h-full" src={`/api/pending/${book.id}`}></iframe>
      <Toast.Provider swipeDirection="right">
          <Form {...form}>
            <form className="flex flex-col p-4 gap-8" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) =>
                  <FormItem className="flex flex-col gap-2 h-16">
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <input {...field} required className="p-2 bg-slate-700 rounded-sm"/>
                    </FormControl>
                  </FormItem>
                } />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) =>
                  <FormItem className="flex flex-col gap-2 h-16">
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <input {...field} required className="p-2 bg-slate-700 rounded-sm"/>
                    </FormControl>
                  </FormItem>
                }
              />
              <FormField
                control={form.control}
                name="lang"
                render={({ field }) =>
                  <FormItem>
                    <FormLabel>Lenguaje</FormLabel>
                    <FormControl>
                      <Select defaultValue={field.value.id.toString()} onValueChange={(id) => field.onChange(languages.find((l) => l.id == Number(id)))}>
                        <SelectTrigger className=" flex flex-row gap-4 bg-slate-700 items-center justify-between p-4 min-h-fit rounded text-sm" aria-label="Lenguaje">
                          <SelectValue placeholder={field.value.text} />
                        </SelectTrigger>
                        <SelectContent className="">
                          {languages.map(l =>
                            <SelectItem key={l.id} value={l.id.toString()} className='hover:bg-green-600'>
                              {l.language}
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                }
              />
              <FormField
                control={form.control}
                name="authors"
                render={({ field }) =>
                  <FormItem className="h-fit">
                    <FormLabel>Autores</FormLabel>
                    <FormControl>
                      <MultiSelect
                        defaultValue={field.value.map((v) => v.id.toString())}
                        onValueChange={(e) => field.onChange(e.map((a) => { return { id: Number(a), text: authorOptions.find((s) => s.id.toString() === a)?.text }}))}
                        options={authorOptions.map((a) => { return { value: a.id.toString(), label: a.text}})}
                        selectAllText="Seleccionar todas"
                        searchText="Buscar..."
                        placeholder="Selecciona los autores" className="w-full h-fit bg-slate-700" />
                    </FormControl>
                  </FormItem>
                }
              />
              <Button type="submit" className="bg-green-400 text-black">Guardar</Button>
            </form>
          </Form>
        <Toast.Root open={open} onOpenChange={setOpen}
          className="p-5 grid grid-cols-2">
          <Toast.Title>Guardado!</Toast.Title>
        </Toast.Root>
        <Toast.Viewport className="fixed right-0 bottom-0" />
      </Toast.Provider>
    </div>
  )
}
