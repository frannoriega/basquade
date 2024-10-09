import Actions from "@/components/navbar/actions";
import SearchBar from "@/components/navbar/search";
import { getCategories } from "@/lib/db/categories";
import { Sprout } from "lucide-react";

export default async function Navbar() {
  const categories = await getCategories()
  return (
    <div className="sticky top-0 z-50 flex h-20 min-w-fit flex-row items-center justify-between gap-4 dark:bg-gray-950/70 bg-gray-100/70 backdrop-blur-md pl-8 pr-8 border-gray-300/70 dark:border-gray-800 border-b">
      <div className="flex flex-row items-center gap-4">
        <Sprout className="h-8 w-8" />
        <a href="/">
          <h1 className="flex flex-col items-center">Biblioteca <span className="text-3xl font-black">Basqüadé</span></h1>
        </a>
      </div>
      <div className="flex flex-row items-center md:gap-8 gap-6">
        <SearchBar categories={categories.map((c) => { return { id: c.id, name: c.name } })} />
        <Actions />
      </div>
    </div>
  );
}

