import AdminList from "@/components/admin-list";
import { getAdmins } from "@/lib/db/admins"

export const dynamic = 'force-dynamic'

export default async function AdministratorsPage() {
  const admins = await getAdmins();
  return (
    <div className="p-4 flex flex-col gap-4 h-full">
      <div>Administradores</div>
      <AdminList admins={admins}/>
    </div>
  )
}
