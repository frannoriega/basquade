import PendingPanel from "@/components/pending-panel";
import { getPending} from "@/lib/db/books";
import Link from "next/link";

export default async function PendingPage() {
  const books = await getPending()
  if (!books) {
    return <div>No hay pendientes</div>
  }
  const strippedBooks = books.map((b) => { return {
    id: b.id,
    title: b.title,
    description: b.description,
    authors: b.authors.map((a) => a.author),
    lang: b.lang,
    category: b.category
  }})
  return (
    <div className="p-4 flex flex-col gap-4 h-full">
      <h1>Pendientes</h1>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {strippedBooks.map((b) => (
            <tr>
              <td>{b.title}</td>
              <td>{b.description}</td>
              <Link href={`/admin/pendientes/${b.id}`}>
                <td>Editar</td>
              </Link>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}