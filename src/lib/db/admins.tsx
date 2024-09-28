'use server'

import prisma from "@/lib/prisma";
import { Admin } from "@prisma/client";

async function getAdmins(): Promise<Admin[]> {
  return await prisma.admin.findMany({
    orderBy: [
      {
        permanent: 'desc'
      },
      {
        lastname: 'asc'
      }
    ]
  })
}

async function getAdmin(email: string): Promise<Admin | null> {
  return await prisma.admin.findUnique({
    where: {
      email: email
    }
  })
}

async function removeAdmins(admins: number[]): Promise<number> {
  return await prisma.admin.deleteMany({
    where: {
      id: {
        in: admins
      }
    }
  }).then((r) => r.count)
}

type NewAdmin = {
  name: string,
  lastname: string,
  email: string,
  dni: number
}

async function addAdmin(admin: NewAdmin): Promise<Admin> {
  return await prisma.admin.create({
    data: {
      name: admin.name,
      lastname: admin.lastname,
      email: admin.email,
      dni: admin.dni,
      permanent: false
    }
  })
}

export { getAdmins, getAdmin, removeAdmins, addAdmin }
