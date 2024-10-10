import AdminList from "@/components/admin-list";
import { getAdmins } from "@/lib/db/admins"
import { Users } from "lucide-react";

export const dynamic = 'force-dynamic'

export default async function AdministratorsPage() {
  const admins = await getAdmins();
  return (
    <div className="p-4 flex flex-col gap-4 h-full">
      <div className="flex flex-row gap-4">
        <Users className="h-10 self-end"/>
        <h1 className="text-3xl font-semibold">Administradores</h1>
      </div>
      <AdminList admins={admins}/>
    </div>
  )
}
