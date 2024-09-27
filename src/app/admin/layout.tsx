import { cn } from "@/lib/utils";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-5 rounded-lg overflow-hidden w-full pt-12 pb-12">
      <ul className="col-span-1 bg-green-300 dark:bg-green-800 w-full rounded-l-lg">
        <Link href="/admin" className="hover:bg-slate-400">
          <FormattedLi>Dashboard</FormattedLi>
        </Link>
        <Link href="/admin/administrators">
          <FormattedLi>Administradores</FormattedLi>
        </Link>
        <Link href="/admin/cases">
          <FormattedLi>Casos</FormattedLi>
        </Link>
      </ul>
      <div className="col-span-4">
        {children}
      </div>
    </div>
  )
}

type FormattedLiParams = React.ComponentProps<"li">

function FormattedLi({ className, children }: FormattedLiParams) {
  const cns = cn("p-2 w-full hover:bg-slate-400", className)
  return <li className={cns}>{children}</li>
}
