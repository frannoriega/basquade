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

export { getAdmins, getAdmin }
