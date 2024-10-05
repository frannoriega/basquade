'use client'
import { useForm } from "react-hook-form";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React from "react";
import * as Toast from "@radix-ui/react-toast";
import { createCase } from "@/lib/db/cases";
import Link from "next/link";

type CaseListParams = {
  cases: {
    id: number,
    name: string,
    description: string,
    books: number
  }[],
  categories: {
    id: number,
    name: string
  }[],
}

const createCaseSchema = z.object({
  name: z.string().min(5, {
    message: "Ingrese un nombre de al menos 5 letras"
  }),
  description: z.string().min(20, {
    message: "Ingrese una descripción detallada, de al menos 20 letras"
  }),
  category: z.object({
    id: z.number(),
    name: z.string()
  })
})

export default function CaseList({ cases, categories }: CaseListParams) {
  const addCase = useForm<z.infer<typeof createCaseSchema>>({
    resolver: zodResolver(createCaseSchema),
    defaultValues: {
      name: '',
      description: '',
      category: categories[0],
    }
  })

  const [open, setOpen] = React.useState(false);
  const [msg, setMsg] = React.useState("Guardado!");
  const timerRef = React.useRef(0);

  React.useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  async function submitCase(values: z.infer<typeof createCaseSchema>) {
    const newCase = {
      name: values.name,
      description: values.description,
      categoryId: values.category.id
    }
    console.log(newCase)
    await createCase(newCase)
    setMsg("Guardado!")
    setOpen(false);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setOpen(true);
    }, 100);
  }
  return (
    <div className="p-4 flex flex-col gap-4 h-full">
      <h1>Casos</h1>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Libros</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cases.map((b) => (
            <tr key={b.id}>
              <td>{b.name}</td>
              <td>{b.description}</td>
              <td>{b.books}</td>
              <td>
                <Link href={`/admin/casos/${b.id}`}>Editar</Link>
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
              <DialogTitle>Agregar nuevo caso</DialogTitle>
              <VisuallyHidden>
                <DialogDescription>Formulario para agregar a un nuevo caso</DialogDescription>
              </VisuallyHidden>
            </DialogHeader>
            <Form {...addCase}>
              <form onSubmit={addCase.handleSubmit(submitCase)}>
                <FormField
                  control={addCase.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={addCase.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={addCase.control}
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
                <Button type="submit">Agregar</Button>
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
