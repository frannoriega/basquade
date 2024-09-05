'use client'
import { Search } from "lucide-react";

import Modal from "react-modal";
import React from "react";
import Filter from "@/components/navbar/search/filter";


export default function SearchBar() {
  try {
    Modal.setAppElement("#app");
  } catch (_) {

  }
  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const options = [
    { value: "Todos", label: "Todos" },
    { value: "A", label: "A" }
  ]
  const defaultOption = options[0]
  const [selectedOption, setSelectedOption] = React.useState(defaultOption);

  return (
    <>
      <button onClick={openModal} className="bg-transparent dark:bg-green-900 md:bg-green-200 rounded-sm md:shadow-inner md:w-48 h-8 flex flex-row items-stretch justify-between pl-2 pr-2 text-sm text-green-600 dark:text-green-300 md:hover:bg-green-300" >

        <div className="flex flex-row gap-2 items-center ">
          <Search />
          <span className="hidden md:inline-block">Buscar</span>
        </div>
        <kbd className="hidden md:flex flex-row items-center gap-1 font-sans font-semibold">
          <abbr className="no-underline" title="Command">⌘</abbr> <span>K</span>
        </kbd>
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="absolute top-40 grid grid-cols-12 gap-4 w-full"
        overlayClassName="fixed top-0 right-0 left-0 bottom-0 backdrop-blur-md bg-gray-700/30"
      >
        <form className="w-full col-start-3 col-span-8">
          <div className="flex flex-row h-16">
            <Filter/>
            <input type="search" className="rounded-e-md flex items-end bg-green-200 outline-0 p-2.5 w-full z-20 text-sm placeholder-green-600 text-green-600 dark:placeholder-gray-400 dark:text-white" placeholder="Search Mockups, Logos, Design Templates..." required />
          </div>
        </form>
      </Modal>
    </>

  );
}
