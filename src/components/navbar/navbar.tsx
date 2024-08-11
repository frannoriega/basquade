import { Search } from "lucide-react";

import Actions from "@/components/navbar/actions/actions";

export default function Navbar() {
  return (
    <div className="flex h-16 min-w-fit flex-row items-center justify-between gap-4 bg-slate-50 pl-4 pr-4">
      <a href="/"><h1 className="text-3xl">Basqüadé</h1></a>
      <div className="flex flex-row items-center md:gap-8 gap-6">
          <SearchBar />
          <Actions />
      </div>
    </div>
  );
}

function SearchBar() {
  return (
    <button className="bg-transparent md:bg-green-200 rounded-sm md:shadow-inner md:w-48 h-8 flex flex-row items-stretch justify-between pl-2 pr-2 text-sm text-green-600 dark:text-green-300 md:hover:bg-green-300" >

      <div className="flex flex-row gap-2 items-center ">
        <Search />
        <span className="hidden md:inline-block">Buscar</span>
      </div>
      <kbd className="hidden md:flex flex-row items-center gap-1 font-sans font-semibold">
         <abbr className="no-underline" title="Command">⌘</abbr> <span>K</span>
      </kbd>
    </button>
  );
}
