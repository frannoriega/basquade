'use client'

import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from "react"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import { Input } from "../ui/input"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  enableRowSelection?: boolean | ((row: Row<TData>) => boolean)
  getRowId?: (
    originalRow: TData,
    index: number,
    parent?: Row<TData>
  ) => string,
  onSelect?: (values: { [id: string]: boolean }) => void,
  filterBy?: string,
  hideableColumns?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  enableRowSelection,
  getRowId,
  onSelect,
  filterBy,
  hideableColumns
}: DataTableProps<TData, TValue>) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const [sorting, setSorting] = useState<SortingState>([])

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )

  const [rowSelection, setRowSelection] = useState({})
  useEffect(() => {
    setRowSelection({})
  }, [data])

  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>({})

  if (onSelect) {
    useEffect(() => {
      onSelect(rowSelection)
    }, [rowSelection])
  }

  const table = useReactTable({
    data,
    columns,
    getRowId: getRowId,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    enableRowSelection: enableRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      columnVisibility
    },
  })

  console.log(table.getHeaderGroups())

  // Fix para problemas de hydration con extensiones de navegador ¯\_(ツ)_/¯
  if (!isClient) return null
  return (
    <div className="flex flex-col self-stretch grow">
      <div className="flex items-center py-4">
        {filterBy &&
          <Input
            placeholder={`Filtrar por ${filterBy.toLowerCase()}`}
            value={(table.getColumn(filterBy)?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn(filterBy)?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        }
        {(hideableColumns ?? true) &&
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columnas
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter(
                  (column) => column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        }
      </div>
      <div className="rounded-md border self-stretch grow">
        <Table className="block md:table w-full">
          <TableHeader className="block md:table-header-group">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="block md:table-row absolute md:static -top-[9999px] md:top-auto -left-[9999px] md:left-auto">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="block md:table-cell">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="block md:table-row-group">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="block md:table-row p-1"
                >
                  {row.getVisibleCells().map((cell, i) => (
                    <TableCell key={cell.id} className="block md:table-cell relative md:static pl-[calc(50%+10px)] !text-left whitespace-pre-wrap md:whitespace-normal break-words md:break-normal md:pl-4">
                      <div className="h-full absolute top-0 md:static flex flex-row items-center md:hidden left-4 w-[calc(50%-20px)] md:w-0 text-left whitespace-pre-wrap break-words">
                        {table.getHeaderGroups()[0].headers[i].isPlaceholder
                          ? null
                          : flexRender(
                            table.getHeaderGroups()[0].headers[i].column.columnDef.header,
                            table.getHeaderGroups()[0].headers[i].getContext()
                          )
                        }
                      </div>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-inherit block md:table-row">
                <TableCell colSpan={columns.length} className="h-24 text-center block md:table-cell">
                  No hay resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
