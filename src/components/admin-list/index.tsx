'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form"
import { Checkbox } from "../ui/checkbox"
import { Button } from "../ui/button"
import { removeAdmins as removeAdminsDb, addAdmin as addAdminDb } from "@/lib/db/admins"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { useState } from "react"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

const removeAdminSchema = z.object({
  admins: z.array(z.number())
})

const addAdminSchema = z.object({
  name: z.string().min(2),
  surname: z.string().min(2),
  email: z.string().email(),
  dni: z.number({
    coerce: true
  }),
})

type AdminListParams = {
  admins: {
    id: number,
    fullname: string,
    email: string,
    dni: number,
    permanent: boolean
  }[]
}

function equalArrays(a1: number[], a2: number[]) {
  if (a1.length != a2.length) {
    return false
  }
  const a1_sorted = a1.sort()
  const a2_sorted = a2.sort()
  for (var i = 0; i < a1.length; i++) {
    if (a1_sorted[i] != a2_sorted[i]) {
      return false
    }
  }
  return true
}

export default function AdminList({ admins }: AdminListParams) {
  const [currentAdmins, setAdmins] = useState(admins)
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
    await removeAdminsDb(values.admins)
    setAdmins(currentAdmins.filter((a) => !values.admins.includes(a.id)))
  }
  async function addAdmin(values: z.infer<typeof addAdminSchema>) {
    const admin = await addAdminDb(values)
    setAdmins([...currentAdmins, {
      id: admin.id,
      fullname: `${admin.name} ${admin.lastname}`,
      email: admin.email,
      dni: admin.dni,
      permanent: admin.permanent
    }])
  }
  return (
    <div className="relative w-full h-full flex flex-col gap-4">
      <Form {...removeForm}>
        <form id="remove-admins" className="flex flex-col h-full" onSubmit={removeForm.handleSubmit(removeAdmins)}>
          <div className="grow self-stretch h-full rounded-lg overflow-hidden border border-slate-300">
            <table className="table-auto w-full border-collapse">
              <thead className="w-full p-4 h-full rounded-t-md">
                <tr className="row w-full text-start rounded-t-md border-b bg-slate-700">
                  <th className="h-10 rounded-tl-md">
                    <FormField
                      control={removeForm.control}
                      name="admins"
                      render={({ field }) =>
                        <FormItem className="pl-2 pr-2 grid justify-items-center items-center">
                          <FormControl>
                            <Checkbox
                              checked={equalArrays(currentAdmins.filter((a) => !a.permanent).map((a) => a.id), field.value)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange(currentAdmins.filter((a) => !a.permanent).map((a) => a.id))
                                  : field.onChange([])
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      }
                    />
                  </th>
                  <th className="text-start pl-2">Nombre completo</th>
                  <th className="text-start pl-2">Email</th>
                  <th className="text-start pl-2 rounded-tr-md">DNI</th>
                </tr>
              </thead>
              <tbody>
                {currentAdmins.map((a) => (
                  <tr key={a.id} className="h-10 border-b border-slate-300">
                    <td className="h-10 grid items-center justify-items-center">
                      {a.permanent ? null :
                        <FormField
                          control={removeForm.control}
                          name="admins"
                          key={a.id}
                          render={({ field }) =>
                            <FormItem>
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(a.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, a.id])
                                      : field.onChange(field.value?.filter((v) => v != a.id))
                                  }}
                                />
                              </FormControl>
                            </FormItem>
                          }
                        />
                      }
                    </td>
                    <td className="pl-2">{a.fullname}</td>
                    <td className="pl-2">{a.email}</td>
                    <td className="pl-2">{a.dni}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </form>
      </Form>
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
            <Form {...addForm}>
              <form onSubmit={addForm.handleSubmit(addAdmin)} className="flex flex-col gap-4">
                <FormField
                  control={addForm.control}
                  name="name"
                  render={({ field }) =>
                    <FormItem className="flex flex-col">
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <input {...field} value={field.value ?? ''} type="text" required />
                      </FormControl>
                    </FormItem>
                  }
                />
                <FormField
                  control={addForm.control}
                  name="surname"
                  render={({ field }) =>
                    <FormItem className="flex flex-col">
                      <FormLabel>Apellido</FormLabel>
                      <FormControl>
                        <input {...field} value={field.value ?? ''} type="text" required className="col-span-2" />
                      </FormControl>
                    </FormItem>
                  }
                />
                <FormField
                  control={addForm.control}
                  name="email"
                  render={({ field }) =>
                    <FormItem className="flex flex-col">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <input {...field} value={field.value ?? ''} type="email" required className="col-span-2" />
                      </FormControl>
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
                        <input {...field} value={field.value ?? ''} type="text" required className="col-span-2" />
                      </FormControl>
                    </FormItem>
                  }
                />
                <DialogClose asChild>
                  <Button type="submit">Agregar</Button>
                </DialogClose>
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

