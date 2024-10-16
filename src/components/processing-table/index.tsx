'use client'

import { DataTable } from "../data-table"
import { BookToProcess, columns } from "./columns"

export default function ProcessingTable({ books }: { books: BookToProcess[] }) {
  return (
    <DataTable columns={columns} data={books} filterBy={{ id: 'title', display: 'Título' }} />
  )
}
