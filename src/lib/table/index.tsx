import '@tanstack/react-table' //or vue, svelte, solid, qwik, etc.
import { ColumnMeta, RowData } from '@tanstack/react-table'

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    name: string
  }
}
