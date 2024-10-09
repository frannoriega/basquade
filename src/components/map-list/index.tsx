'use client'
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React from "react";
import * as Toast from "@radix-ui/react-toast";
import { createBookMap } from "@/lib/db/bookmaps";
import Link from "next/link";

type BookMapListParams = {
  bookMaps: {
    id: number,
    name: string,
    description: string,
    books: number
  }[],
  shelves: {
    id: number,
    name: string
  }[],
}

const createBookMapSchema = z.object({
  name: z.string().min(5, {
    message: "Ingrese un nombre de al menos 5 letras"
  }),
  description: z.string().min(20, {
    message: "Ingrese una descripción detallada, de al menos 20 letras"
  }),
  shelf: z.object({
    id: z.number(),
    name: z.string()
  })
})

export default function BookMapList({ bookMaps, shelves }: BookMapListParams) {
  const addBookMap = useForm<z.infer<typeof createBookMapSchema>>({
    resolver: zodResolver(createBookMapSchema),
    defaultValues: {
      name: '',
      description: '',
      shelf: shelves[0],
    }
  })

  const [open, setOpen] = React.useState(false);
  const [msg, setMsg] = React.useState("Guardado!");
  const timerRef = React.useRef(0);

  React.useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  async function submitBookMap(values: z.infer<typeof createBookMapSchema>) {
    const newBookMap = {
      name: values.name,
      description: values.description,
      shelfId: values.shelf.id
    }
    console.log(newBookMap)
    await createBookMap(newBookMap)
    setMsg("Guardado!")
    setOpen(false);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setOpen(true);
    }, 100);
  }
  return (
    <div className="p-4 flex flex-col gap-4 h-full">
      <h1>Mapas conceptuales</h1>
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
          {bookMaps.map((b) => (
            <tr key={b.id}>
              <td>{b.name}</td>
              <td>{b.description}</td>
              <td>{b.books}</td>
              <td>
                <Link href={`/admin/mapas/${b.id}`}>Editar</Link>
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
          <DialogContent className="bg-gray-700">
            <DialogHeader>
              <DialogTitle>Agregar nuevo caso</DialogTitle>
              <VisuallyHidden>
                <DialogDescription>Formulario para agregar a un nuevo caso</DialogDescription>
              </VisuallyHidden>
            </DialogHeader>
            <Form {...addBookMap}>
              <form onSubmit={addBookMap.handleSubmit(submitBookMap)}>
                <FormField
                  control={addBookMap.control}
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
                  control={addBookMap.control}
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
                  control={addBookMap.control}
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
