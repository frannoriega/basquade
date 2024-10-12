import { BookPreview } from "@/data/book-preview";
import { DataTable } from "../data-table";
import { columns } from "./columns";

type GalleryParams = {
  books: BookPreview[]
}

export default function BookTable({ books }: GalleryParams) {
  return (
    <DataTable
      columns={columns}
      data={books}
      filterBy={{ key: "title", display: "título" }}
      hideableColumns={false}
    />
  )
}
