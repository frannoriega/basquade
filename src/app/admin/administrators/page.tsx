import AdminList from "@/components/admin-list";
import { MultiSelect } from "@/components/ui/multiselect";
import { getAdmins } from "@/lib/db/admins"

export default async function AdministratorsPage() {
  const admins = await getAdmins();
  console.log(admins)
  const adminOptions = admins.map((a) => {
    return {
      id: a.id,
      fullname: `${a.name} ${a.lastname}`,
      email: a.email,
      dni: a.dni,
      permanent: a.permanent
    }
  })
  return (
    <div className="p-4 flex flex-col gap-4 h-full">
      <div>Administradores</div>
      <AdminList admins={adminOptions}/>
    </div>
  )
}
