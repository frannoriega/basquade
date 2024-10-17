'use client'

import { DataTable } from "../data-table"
import { columns } from "./columns"

export default function MapTable({ maps }: { maps: BookMap[] }) {
  return (
    <DataTable
      columns={columns}
      data={maps}
      filterBy={{ id: 'name', display: 'Nombre' }}
    />
  )
}
