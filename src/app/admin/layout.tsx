import { cn } from "@/lib/utils";
import { LayoutDashboard, Settings, UsersRound, Map, ListTodo, BookText, Globe } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-8 grid grid-cols-5 rounded-lg overflow-hidden w-full pt-12 pb-12">
      <div className="col-span-1 bg-gray-300 dark:bg-gray-800 w-full rounded-l-lg flex flex-col">
        <div className="flex flex-row w-full items-center gap-2 mb-8 p-4">
          <Settings className="w-fit" />
          <h1 className="text-xl self-center font-bold">Panel de control</h1>
        </div>
        <ul className="flex flex-col">
          <PanelOption href="/admin">
            <LayoutDashboard />
            <h2>Dashboard</h2>
          </PanelOption>
          <PanelOption href="/admin/administradores">
            <UsersRound />
            <h2>
              Administradores
            </h2>
          </PanelOption>
          <PanelOption href="/admin/libros">
            <BookText />
            <h2>Libros</h2>
          </PanelOption>
          <PanelOption href="/admin/pendientes">
            <ListTodo />
            <h2>Pendientes</h2>
          </PanelOption>
          <PanelOption href="/admin/mapas">
            <Map />
            <h2>Mapas conceptuales</h2>
          </PanelOption>
          <PanelOption href="/admin/atlas">
            <Globe />
            <h2>Atlas conceptual</h2>
          </PanelOption>
        </ul>
      </div>
      <div className="col-span-4">
        {children}
      </div>
    </div>
  )
}

function PanelOption({ className, children, href }: React.ComponentProps<typeof Link>) {
  const cns = cn("w-full p-4 focus:bg-gray-400 flex flex-row gap-2", className)
  return (
    <Link href={href} className="hover:border-s-4 hover:border-green-800">
      <li className={cns}>
        {children}
      </li>
    </Link>
  )
}
