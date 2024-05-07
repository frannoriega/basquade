"use client";

import { Search } from "lucide-react";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function TopBar() {
  return (
    <div className="flex h-16 flex-row items-center gap-4 bg-blue-300 pl-4 pr-4">
      <h1>Basquadé</h1>
      <SearchBar />
      <Actions />
      <Profile />
    </div>
  );
}

function SearchBar() {
  return (
    <div className="m-auto flex w-full justify-center lg:max-w-lg">
      <div className="relative m-auto w-full">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          className="h-10 w-full rounded-full border-none bg-background pl-8 hover:bg-gray-200  focus:bg-gray-200 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder="Buscar..."
          type="search"
          // TODO: Add shadow around the input
        />
      </div>
    </div>
  );
}

function Actions() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          {/* TODO: Implement pending page */}
          <Link href="/pending" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Pendientes
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function Profile() {
  return (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
}
