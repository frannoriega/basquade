import { Button } from "@/components/ui/button";
import { getPending } from "@/lib/db/books";

export const dynamic = 'force-dynamic'

export default async function PendingPage() {
  const books = await getPending()
  if (!books) {
    return <div>No hay pendientes</div>
  }
  const strippedBooks = books.map((b) => {
    return {
      id: b.id,
      title: b.title,
      description: b.description,
      authors: b.authors.map((a) => a.author),
      lang: b.lang,
      category: b.category
    }
  })
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
              <td>
                <Button>
                  Editar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
