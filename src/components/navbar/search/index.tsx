'use client'
import { Search } from "lucide-react";

import React from "react";
import Filter from "@/components/navbar/search/filter";
import * as Dialog from "@radix-ui/react-dialog";


export default function SearchBar() {
  const options = [
    { value: "Todos", label: "Todos" },
    { value: "A", label: "A" }
  ]

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="bg-transparent dark:bg-green-800 md:bg-green-200 rounded-sm md:w-48 h-8 flex flex-row items-stretch justify-between pl-2 pr-2 text-sm text-green-600 dark:text-green-300 md:hover:bg-green-300" >

          <div className="flex flex-row gap-2 items-center ">
            <Search />
            <span className="hidden md:inline-block">Buscar</span>
          </div>
          <kbd className="hidden md:flex flex-row items-center gap-1 font-sans font-semibold">
            <abbr className="no-underline" title="Command">⌘</abbr> <span>K</span>
          </kbd>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed top-0 right-0 left-0 bottom-0 backdrop-blur-md bg-gray-700/30"/>
        <Dialog.Content className="absolute top-40 grid grid-cols-12 gap-4 w-full">
          <form className="w-full col-start-3 col-span-8">
            <div className="flex flex-row h-16">
              <Filter/>
              <input type="search" className="rounded-e-md flex items-end bg-green-200 outline-0 p-2.5 w-full z-20 text-sm placeholder-green-600 text-green-600 dark:placeholder-gray-400 dark:text-white" placeholder="Search Mockups, Logos, Design Templates..." required />
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>

  );
}
