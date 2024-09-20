import { BookPreview } from "@/data/book-preview";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export default function Gallery({ books }: { books: BookPreview[] }) {
  return (
      <ol className="flex flex-col gap-4">
        {
          books.map((b) =>
            <Link key={b.id} href={`/api/pdf/${b.id}`}>
            <Card>
              <CardHeader className="font-extrabold">
                {b.title}
              </CardHeader>
              <CardContent>
                {b.description}
              </CardContent>
              <CardFooter className="text-slate-400">
                Autores: <ul>{b.author.map((a) => <li>{a}</li>)}</ul>
              </CardFooter>
            </Card>
            </Link>
          )
        }
      </ol>
  )
}
