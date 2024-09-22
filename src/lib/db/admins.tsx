import prisma from "@/lib/prisma";
import { Admin } from "@prisma/client";

async function getAdmins(): Promise<Admin[]> {
  return await prisma.admin.findMany()
}

export { getAdmins }
