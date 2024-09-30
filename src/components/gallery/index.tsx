import { BookPreview } from "@/data/book-preview";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

type GalleryParams = {
  books: BookPreview[]
} & React.ComponentProps<"ol">

export default function Gallery({ books, className, ...props }: GalleryParams) {
  const cns = cn("grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8", className)
  return (
    <ol className={cns} {...props}>
      {
        books.map((b) => {
          const base64String = b.cover.toString("base64")
          return (
            <HoverCard>
              <HoverCardTrigger asChild>
                <Link key={b.id} href={`/api/pdf/${b.id}`} className="flex flex-col w-fit">
                  <li className="w-full">
                    <Card>
                      <CardTitle className="text-center p-2">{b.title}</CardTitle>
                      <VisuallyHidden>
                        <CardDescription>{b.description}</CardDescription>
                      </VisuallyHidden>
                      <CardContent className="flex flex-col">
                        <img className="h-96 w-full" src={`data:image/png;base64,${base64String}`} alt={b.title} width={256} height={362}></img>
                      </CardContent>
                    </Card>
                  </li>
                </Link>
              </HoverCardTrigger>
              <HoverCardContent side="right">
                {b.description}
              </HoverCardContent>
            </HoverCard>
          )
        }
        )
      }
    </ol>
  )
}
