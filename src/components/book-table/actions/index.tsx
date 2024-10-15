import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import UpdateForm from "@/components/update-form";
import { BookInfo } from "@/types/books";
import { Author } from "@prisma/client";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { EyeIcon, Pencil } from "lucide-react";
import Link from "next/link";

type Language = {
  id: number,
  display: string
}

type Shelf = {
  id: number,
  name: string,
  description: string
}

type ActionsParams = {
  formId: string,
  book: BookInfo,
  languages: Language[],
  shelves: Shelf[],
  authors: Author[]
}

export default function Actions({ formId, book, languages, shelves, authors }: ActionsParams) {
  return (
    <div className="flex flex-row w-full gap-4">
      <Link href={`/api/pdf/${book.id}`} className={buttonVariants({ variant: 'ghost' })}><EyeIcon /></Link>
      <Dialog >
        <DialogTrigger asChild>
          <Button variant='ghost'><Pencil /></Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editando libro {book.title}</DialogTitle>
            <VisuallyHidden>
              <DialogDescription>Pantalla para editar libro {book.title}</DialogDescription>
            </VisuallyHidden>
          </DialogHeader>
          <UpdateForm formId={formId} book={book} languages={languages} shelves={shelves} authors={authors} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
