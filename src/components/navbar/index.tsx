import Actions from "@/components/navbar/actions";
import SearchBar from "@/components/navbar/search";
import { getShelves } from "@/lib/db/shelves";
import { Sprout } from "lucide-react";
import Link from "next/link";
import { Badge } from "../ui/badge";

export default async function Navbar() {
  const shelves = await getShelves()
  return (
    <div className="sticky top-0 z-10 flex h-20 w-full flex-row items-center justify-between gap-4 dark:bg-gray-950/70 bg-gray-50/70 backdrop-blur-md pl-4 sm:pl-8 pr-8 border-gray-300/70 dark:border-gray-800 border-b">
      <Link href="/" className="flex flex-row items-center gap-1">
        <Sprout className="h-6 w-6 sm:h-8 sm:w-8" />
        <h1 className="items-center text-xl sm:text-3xl font-black">Basqüadé</h1>
        <Badge variant='secondary'>beta</Badge>
      </Link>
      <div className="flex flex-row items-center md:gap-8 gap-0">
        <SearchBar shelves={shelves.map((c) => { return { id: c.id, name: c.name } })} />
        <Actions />
      </div>
    </div>
  );
}

