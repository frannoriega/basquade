"use client";

import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@radix-ui/react-navigation-menu";
import { Search } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Navbar() {
  return (
    <div className="flex h-16 min-w-fit flex-row items-center justify-between gap-4 bg-slate-50 pl-4 pr-4">
      <a href="/"><h1 className="text-3xl">Basquadé</h1></a>
      <div className="flex flex-row items-center gap-8">
        <SearchBar />
        <Actions />
        <Profile />
      </div>
    </div>
  );
}

function SearchBar() {
  return (
    <button className="bg-slate-200 rounded-sm shadow-inner w-48 h-8 flex flex-row items-stretch justify-between pl-2 pr-2 text-sm text-slate-400 dark:text-slate-300" >

      <div className="flex flex-row gap-2 items-center ">
        <Search />
        <span>Buscar</span>
      </div>
      <kbd className="flex flex-row items-center gap-1 font-sans font-semibold">
         <abbr className="no-underline" title="Command">⌘</abbr> <span>K</span>
      </kbd>
    </button>
  );
}

function Actions() {
  return (
    <>
    <NavigationMenu className="hidden md:inline-block">
      <NavigationMenuList className="flex flex-row gap-8 items-center">
        <NavigationMenuItem className="w-16 text-center">
          {/* TODO: Implement pending page */}
          <Link href="/quienessomos" legacyBehavior passHref>
            <NavigationMenuLink >
              Quienes somos
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem className="text-center">
          {/* TODO: Implement pending page */}
          <Link href="/blog" legacyBehavior passHref>
            <NavigationMenuLink >
              Blog
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem className="text-center">
          {/* TODO: Implement pending page */}
          <Link href="/quienessomos" legacyBehavior passHref>
            <NavigationMenuLink >
              Contacto
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem className="p-2 rounded-lg bg-green-600 text-slate-50">
          {/* TODO: Implement pending page */}
          <Link href="/pendientes" legacyBehavior passHref>
            <NavigationMenuLink >
              Pendientes
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
      <button className="md:hidden">Hamburger</button>
    </>
  );
}

function Profile() {
  return (
    <div className="flex flex-row before:left-[-42.5%] before:top-[-30%] before:z-[1] before:bg-slate-800 before:w-[1px] before:h-8 before:block before:absolute before:translate-x-2/4 before:translate-y-2/4 relative z-0">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </div>
  );
}
