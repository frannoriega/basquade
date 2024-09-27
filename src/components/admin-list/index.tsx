'use client'

type AdminListParams = {
  admins: {
    id: number,
    fullname: string,
    email: string,
    dni: number,
    permanent: boolean
  }[]
}

export default function AdminList({ admins }: AdminListParams) {
  return (
    <div className="relative w-full">
      <table className="table-auto w-full border-collapse">
        <thead className="w-full p-4 h-full bg-slate-700">
          <tr className="row w-full h-full text-start">
            <th className="text-start p-2 rounded-tl-md">Todos</th>
            <th className="text-start">Nombre completo</th>
            <th className="text-start">Email</th>
            <th className="text-start rounded-tr-md">DNI</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((a) => (
            <tr key={a.id}>
              {a.permanent ? <td></td> : <td>Check</td>}
              <td className="pt-2">{a.fullname}</td>
              <td>{a.email}</td>
              <td>{a.dni}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

