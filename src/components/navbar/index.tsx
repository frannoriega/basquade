import Actions from "@/components/navbar/actions";
import SearchBar from "@/components/navbar/search";


export default function Navbar() {
  return (
    <div className="flex h-16 min-w-fit flex-row items-center justify-between gap-4 dark:bg-slate-900 bg-slate-50 pl-4 pr-4">
      <a href="/">
        <h1 className="flex flex-col items-center">Biblioteca <span className="text-3xl font-black">Basqüadé</span></h1>
      </a>
      <div className="flex flex-row items-center md:gap-8 gap-6">
        <SearchBar />
        <Actions />
      </div>
    </div>
  );
}
