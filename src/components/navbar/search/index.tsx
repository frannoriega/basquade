'use client'
import React, { useEffect, useRef, useState } from "react";
import Filter from "@/components/navbar/search/filter";
import * as Dialog from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useActionKey } from "@/hooks/useActionKey";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  "term": z.string().min(2, {
    message: "Ingrese al menos 2 caracteres"
  }),
  "filter": z.string()
})

export default function SearchBar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      term: "",
      filter: "*"
    },
  })


  function onSubmit(values: z.infer<typeof formSchema>) {
    const params = new URLSearchParams()
    params.append("term", values.term);
    if (values.filter != "*") {
      params.append("filter", values.filter)
    }
    setOpen(false)
    router.replace('/search?'+params.toString())
  }

  const actionKey = useActionKey();

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="bg-transparent dark:bg-green-800 lg:bg-green-200 rounded-lg lg:w-56 h-12 flex items-center justify-between pl-2 pr-2 text-sm text-green-600 space-x-3 dark:text-green-300 lg:hover:bg-green-300" >
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="flex-none"
            aria-hidden="true"
          >
            <path d="m19 19-3.5-3.5" />
            <circle cx="11" cy="11" r="6" />
          </svg>
          <span className="hidden lg:flex flex-auto">Buscar</span>
          <kbd className="hidden lg:inline-block font-sans font-semibold">
            <abbr className="no-underline" title={actionKey[1]}>{actionKey[0]}</abbr>K
          </kbd>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed top-0 right-0 left-0 bottom-0 backdrop-blur-md bg-gray-700/30" />
        <Dialog.Content className="absolute top-40 grid grid-cols-12 gap-4 w-full">
          <VisuallyHidden.Root>
            <Dialog.Title>Buscar</Dialog.Title>
          </VisuallyHidden.Root>
          <VisuallyHidden.Root>
            <Dialog.Description>Buscador de libros de la Biblioteca Basqüadé</Dialog.Description>
          </VisuallyHidden.Root>
          <div className="w-full col-start-3 col-span-8">
            <Form {...form}>
              <form className="flex flex-row h-16" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="filter"
                  render={({ field }) =>
                    <FormItem>
                      <FormControl>
                        <Filter defaultValue={field.value} onValueChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  } />
                <FormField
                  control={form.control}
                  name="term"
                  render={({ field }) =>
                    <FormControl>
                      <input {...field} type="search" className="h-full rounded-e-md flex items-end bg-green-200 outline-0 p-2.5 w-full z-20 text-sm placeholder-green-600 text-green-600 dark:placeholder-gray-400 dark:text-white" placeholder="Escribe para realizar una búsqueda" required />
                    </FormControl>
                  }
                />
              </form>
            </Form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>

  );
}
