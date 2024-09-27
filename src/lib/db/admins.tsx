'use server'

import prisma from "@/lib/prisma";
import { Admin } from "@prisma/client";

async function getAdmins(): Promise<Admin[]> {
  return prisma.admin.findMany()
}

async function getAdmin(email: string): Promise<Admin | null> {
  return prisma.admin.findUnique({
    where: {
      email: email
    }
  })
}

async function removeAdmins(admins: number[]): Promise<number> {
  return prisma.admin.deleteMany({
    where: {
      id: {
        in: admins
      }
    }
  }).then((r) => r.count)
}

type NewAdmin = {
  name: string,
  surname: string,
  email: string,
  dni: number
}

async function addAdmin(admin: NewAdmin): Promise<Admin> {
  return prisma.admin.create({
    data: {
      name: admin.name,
      lastname: admin.surname,
      email: admin.email,
      dni: admin.dni,
      permanent: false
    }
  })
}

export { getAdmins, getAdmin, removeAdmins, addAdmin }
