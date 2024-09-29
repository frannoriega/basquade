import { BookPreview } from "@/data/book-preview";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import Image from "next/image"
import { cn } from "@/lib/utils";

type GalleryParams = {
  books: BookPreview[]
} & React.ComponentProps<"ol">

export default function Gallery({ books, className, ...props }: GalleryParams) {
  const cns = cn("grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8", className)
  return (
    <ol className={cns} {...props}>
      {
        books.map((b) =>
        {
            const base64String = b.cover.toString("base64")
            return <Link key={b.id} href={`/api/pdf/${b.id}`}>
              <li>
                <div className="flex flex-col border border-slate-300 rounded-sm overflow-hidden">
                  <Image className="h-96" src={`data:image/png;base64,${base64String}`} alt={b.title} width={256} height={362}></Image>
                  <span>{b.title}</span>
                  <span>{b.description}</span>
                </div>
              </li>
            </Link>
          }
        )
      }
    </ol>
  )
}
