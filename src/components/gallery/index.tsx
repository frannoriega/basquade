import { BookPreview } from "@/data/book-preview";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type GalleryParams = {
  books: BookPreview[]
} & React.ComponentProps<"ol">

export default function Gallery({ books, className, ...props }: GalleryParams) {
  const cns = cn("flex flex-col gap-4 w-full", className)
  return (
      <ol className={cns} {...props}>
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
              <CardFooter className="gap-1 text-slate-400">
                <p>Autores: {b.author.join(', ')}</p>
              </CardFooter>
            </Card>
            </Link>
          )
        }
      </ol>
  )
}
