'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { removeAdmins as removeAdminsDb, addAdmin as addAdminDb } from "@/lib/db/admins"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { useRouter } from "next/navigation"
import { Admin } from "@prisma/client"
import { useState } from "react"
import { DataTable } from "../data-table"
import { columns } from "./columns"

const removeAdminSchema = z.object({
  admins: z.array(z.number())
})

const addAdminSchema = z.object({
  name: z.string().min(2),
  lastname: z.string().min(2),
  email: z.string()
    .email({
      message: "Ingrese un correo electrónico válido"
    }).endsWith('gmail.com', {
      message: "El correo debe ser una cuenta de Gmail"
    }),
  dni: z.number({
    coerce: true
  }),
})

export default function AdminList({ admins }: { admins: Admin[] }) {
  const router = useRouter();

  const [addAdminOpen, setAddAdminOpen] = useState(false)

  const removeForm = useForm<z.infer<typeof removeAdminSchema>>({
    resolver: zodResolver(removeAdminSchema),
    defaultValues: {
      admins: []
    },
  })

  const addForm = useForm<z.infer<typeof addAdminSchema>>({
    resolver: zodResolver(addAdminSchema),
  })

  async function removeAdmins(values: z.infer<typeof removeAdminSchema>) {
    if (values.admins) {
      await removeAdminsDb(values.admins)
      removeForm.setValue("admins", [])
      router.refresh()
    }
  }
  async function addAdmin(values: z.infer<typeof addAdminSchema>) {
    await addAdminDb(values)
    setAddAdminOpen(false)
    router.refresh()
  }

  return (
    <div className="relative w-full h-full gap-4 flex flex-col self-stretch grow">
      <Form {...removeForm}>
        <form id="remove-admins" className="flex flex-col self-stretch grow" onSubmit={removeForm.handleSubmit(removeAdmins)}>
          <FormField
            control={removeForm.control}
            name="admins"
            render={({ field }) => (
              <FormItem className="flex flex-col self-stretch grow">
                <FormControl>
                  <DataTable
                    columns={columns}
                    data={admins}
                    enableRowSelection={(row) => !row.original.permanent}
                    getRowId={row => row.id.toString()}
                    onSelect={(rows) => {
                      const admins = Object.entries(rows).filter(([_, v]) => v).map(([k, _]) => Number(k))
                      field.onChange(admins)
                    }}
                    filterBy="email"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
      <div className="w-full flex flex-row-reverse gap-4">
        <Dialog open={addAdminOpen} onOpenChange={setAddAdminOpen}>
          <DialogTrigger asChild>
            <Button className="">Agregar</Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-700">
            <DialogHeader>
              <DialogTitle>Agregar nuevo administrador</DialogTitle>
              <VisuallyHidden>
                <DialogDescription>Formulario para agregar a un nuevo administrador</DialogDescription>
              </VisuallyHidden>
            </DialogHeader>
            <Form {...addForm}>
              <form onSubmit={addForm.handleSubmit(addAdmin)} className="flex flex-col gap-4">
                <FormField
                  control={addForm.control}
                  name="name"
                  render={({ field }) =>
                    <FormItem className="flex flex-col">
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <input {...field} value={field.value ?? ''} type="text" required className="rounded-sm" />
                      </FormControl>
                    </FormItem>
                  }
                />
                <FormField
                  control={addForm.control}
                  name="lastname"
                  render={({ field }) =>
                    <FormItem className="flex flex-col">
                      <FormLabel>Apellido</FormLabel>
                      <FormControl>
                        <input {...field} value={field.value ?? ''} type="text" required className="rounded-sm" />
                      </FormControl>
                    </FormItem>
                  }
                />
                <FormField
                  control={addForm.control}
                  name="email"
                  render={({ field }) =>
                    <FormItem className="flex flex-col">
                      <FormLabel className="data-[invalid]:text-red-300">Email</FormLabel>
                      <FormControl>
                        <input {...field} value={field.value ?? ''} type="email" required className="rounded-sm" />
                      </FormControl>
                      <FormMessage className="text-red-300 italic" />
                    </FormItem>
                  }
                />
                <FormField
                  control={addForm.control}
                  name="dni"
                  render={({ field }) =>
                    <FormItem className="flex flex-col">
                      <FormLabel>DNI</FormLabel>
                      <FormControl>
                        <input {...field} value={field.value ?? ''} type="text" required className="rounded-sm" />
                      </FormControl>
                    </FormItem>
                  }
                />
                <Button type="submit">Agregar</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        {removeForm.getValues().admins.length > 0 ?
          <Button variant="destructive" type="submit" form="remove-admins" className="self-start">Borrar</Button>
          : null
        }
      </div>
    </div>
  )
}

