'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { removeAdmins as removeAdminsDb, addAdmin as addAdminDb } from "@/lib/db/admins"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { useRouter } from "next/navigation"
import { Admin } from "@prisma/client"
import { useState } from "react"

const removeAdminSchema = z.object({
  admins: z.array(z.number()).or(z.null())
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

export default function AdminList({ admins }: { admins: Admin[] }) {
  const router = useRouter();

  const [addAdminOpen, setAddAdminOpen] = useState(false)

  const removeForm = useForm<z.infer<typeof removeAdminSchema>>({
    resolver: zodResolver(removeAdminSchema),
    defaultValues: {
      admins: null
    },
  })

  const addForm = useForm<z.infer<typeof addAdminSchema>>({
    resolver: zodResolver(addAdminSchema),
  })

  async function removeAdmins(values: z.infer<typeof removeAdminSchema>) {
    if (values.admins) {
      await removeAdminsDb(values.admins)
      removeForm.setValue("admins", null)
      router.refresh()
    }
  }
  async function addAdmin(values: z.infer<typeof addAdminSchema>) {
    await addAdminDb(values)
    setAddAdminOpen(false)
    router.refresh()
  }

  const deletableAdmins = admins.filter((a) => !a.permanent).map((a) => a.id)
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
                              checked={field.value != null && equalArrays(deletableAdmins, field.value)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange(deletableAdmins)
                                  : field.onChange(null)
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      }
                    />
                  </th>
                  <th className="text-start pl-2">Nombre</th>
                  <th className="text-start pl-2">Apellido</th>
                  <th className="text-start pl-2">Email</th>
                  <th className="text-start pl-2 rounded-tr-md">DNI</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((a) => (
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
                                  checked={(field.value ?? []).includes(a.id)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      return field.onChange([...field.value ?? [], a.id])
                                    } else {
                                      const vals = field.value?.filter((v) => v != a.id)
                                      const valsOrNull = (vals ?? []).length == 0 ? null : vals
                                      return field.onChange(valsOrNull)
                                    }
                                  }}
                                />
                              </FormControl>
                            </FormItem>
                          }
                        />
                      }
                    </td>
                    <td className="pl-2">{a.name}</td>
                    <td className="pl-2">{a.lastname}</td>
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
        <Dialog open={addAdminOpen} onOpenChange={setAddAdminOpen}>
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
                      <FormMessage className="text-red-300 italic"/>
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
        {(removeForm.getValues().admins ?? []).length > 0 ?
          <Button variant="destructive" type="submit" form="remove-admins" className="self-start">Borrar</Button>
          : null
        }
      </div>
    </div>
  )
}

