'use client'
import { buttonVariants } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@radix-ui/react-navigation-menu";
import { LayoutDashboard, Settings, UsersRound, Map, ListTodo, BookText, Globe, CloudCog } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  {
    title: 'Dashboard',
    link: '/admin',
    icon: <LayoutDashboard />
  },
  {
    title: 'Administradores',
    link: '/admin/administradores',
    icon: <UsersRound />
  },
  {
    title: 'Libros',
    link: '/admin/libros',
    icon: <BookText />
  },
  {
    title: 'Pendientes',
    link: '/admin/pendientes',
    icon: <ListTodo />
  },
  {
    title: 'Procesamiento',
    link: '/admin/procesamiento',
    icon: <CloudCog />
  },
  {
    title: 'Mapas conceptuales',
    link: '/admin/mapas',
    icon: <Map />
  },
  {
    title: 'Atlas conceptual',
    link: '/admin/atlas',
    icon: <Globe />
  }
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [selected, setSelected] = useState(pathname)
  return (
    <>
      <div className="hidden lg:grid mx-8 grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 rounded-lg overflow-hidden w-full pt-12 pb-12">
        <div className="col-span-1 bg-accent dark:bg-gray-800 w-full rounded-l-lg flex flex-col">
          <div className="flex flex-row w-full items-center gap-2 mb-8 p-4">
            <Settings className="w-fit" />
            <h1 className="text-xl self-center font-bold">Administración</h1>
          </div>
          <ul className="flex flex-col">
            {links.map((e) => (
              <Link key={e.link} href={e.link} onClick={() => setSelected(e.link)} className="hover:bg-gray-200 dark:hover:bg-gray-700">
                <li className={`w-full p-4 focus:bg-gray-400 flex flex-row gap-2 ${selected == e.link ? "bg-gray-200 dark:bg-gray-700" : null}`}>
                  {e.icon}
                  <h2>{e.title}</h2>
                </li>
              </Link>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-3 xl:col-span-4 flex flex-col">
          {children}
        </div>
      </div>
      <div className="flex flex-col w-full items-center justify-items-center pt-4 lg:hidden">
        <NavigationMenu className="h-fit max-w-[calc(100%-32px)] bg-accent rounded-xl overflow-hidden">
          <NavigationMenuList className="flex flex-row flex-wrap content-evenly justify-evenly place-content-evenly">
            {links.map((e) => (
              <NavigationMenuItem key={e.link}>
                {/* TODO: Implement pending page */}
                <Link href={e.link} legacyBehavior passHref>
                  <NavigationMenuLink onClick={() => setSelected(e.link)} className={cn(buttonVariants({ variant: 'default', size: 'sm' }), `px-3 py-6 rounded-none bg-inherit text-inherit hover:bg-gray-200 dark:hover:bg-gray-700 ${selected == e.link ? "bg-gray-200 dark:bg-gray-700" : null}`)}>
                    {e.icon}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <div className="w-full flex flex-col self-stretch grow">
          {children}
        </div>
      </div>
    </>
  )
}
