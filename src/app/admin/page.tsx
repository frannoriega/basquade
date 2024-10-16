import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuthorCount } from "@/lib/db/authors";
import { getBookMapCount } from "@/lib/db/bookmaps";
import { getBookCount } from "@/lib/db/books";
import { getShelfCount } from "@/lib/db/shelves";
import { Book, NotebookPen, Map, SquareLibrary } from "lucide-react";

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const bookCount = await getBookCount()
  const shelfCount = await getShelfCount()
  const bookMapCount = await getBookMapCount()
  const authorCount = await getAuthorCount()

  return (
    <div className="p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de libros</CardTitle>
          <Book className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{bookCount}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de autores</CardTitle>
          <NotebookPen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{authorCount}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de estanterías</CardTitle>
          <SquareLibrary className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{shelfCount}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de mapas conceptuales</CardTitle>
          <Map className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{bookMapCount}</div>
        </CardContent>
      </Card>
    </div>
  )
}
