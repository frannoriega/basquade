'use client'
import React, { useEffect, useState } from "react";
import Filter from "@/components/navbar/search/filter";
import * as Dialog from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useActionKey } from "@/hooks/useActionKey";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

const formSchema = z.object({
  "term": z.string().min(2, {
    message: "Ingrese al menos 2 caracteres"
  }),
  "filter": z.string()
})

type SearchBarProps = {
  shelves: {
    id: number,
    name: string
  }[]
}

export default function SearchBar({ shelves }: SearchBarProps) {
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
      filter: "all"
    },
  })


  function onSubmit(values: z.infer<typeof formSchema>) {
    const params = new URLSearchParams()
    params.append("term", values.term);
    if (values.filter != "all") {
      params.append("filter", values.filter)
    }
    setOpen(false)
    router.replace('/buscar?' + params.toString())
  }

  const actionKey = useActionKey();

  const keyboardComponent =
    actionKey.length == 0
      ? <div className="rounded-md bg-gray-300 dark:bg-gray-600 w-6 h-2 animate-pulse"></div>
      : <><span className="text-base">{actionKey[0]}</span>K</>

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="bg-transparent dark:bg-transparent lg:dark:bg-green-900 lg:bg-green-200 rounded-lg lg:w-56 h-12 flex items-center justify-between pl-4 pr-4 text-sm text-green-900 space-x-3 dark:text-green-200 lg:focus:bg-green-200 lg:dark:focus:bg-green-800" >
          <div className="flex flex-row items-center">
            <Search className="mr-2 h-4 w-4" />
            <span className="hidden lg:inline-block">
              Buscar
            </span>
          </div>
          <kbd className="pointer-events-none hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[12px] font-medium text-muted-foreground opacity-100">
            {keyboardComponent}
          </kbd>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed top-20 right-0 left-0 bottom-0 backdrop-blur-md bg-gray-700/30" />
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
                        <Filter defaultValue={field.value} onValueChange={field.onChange} shelves={shelves} />
                      </FormControl>
                    </FormItem>
                  } />
                <FormField
                  control={form.control}
                  name="term"
                  render={({ field }) =>
                    <FormControl>
                      <input {...field} autoFocus type="search" className="h-full rounded-e-md flex items-end bg-gray-200 dark:bg-gray-900 outline-0 p-2.5 w-full z-20 text-sm placeholder-gray-950 text-gray-950 dark:placeholder-gray-100 dark:text-white" placeholder="Escribe para realizar una búsqueda" required />
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
