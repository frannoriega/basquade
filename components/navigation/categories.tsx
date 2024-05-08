"use client";

import Link from "next/link";
import Image from "next/image";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import React, { useRef } from "react";

import categoryLogo from "@/public/next.svg";
import { Category } from "@/data/categories";

// TODO:
//  1. Make the scroll buttons absolute (so that they don't take space)
//  2. Make the scroll buttons disappear if we are at the end of the corresponding scroll
//  3. Blur the scroll button background when it's present.
export default function Categories({ categories }: { categories: Category[] }) {
  return (
    <nav>
      <ul className="flex px-2 py-3 gap-8 overflow-auto snap-mandatory snap-x">
        {categories.map(({name, icon}) => {
          return (
            <li className="flex flex-col gap-2 items-center whitespace-nowrap snap-center" key={name}>
              <Image src={icon} width={60} height={60} alt="" /> 
              {name}
            </li>
          )})}
      </ul>
    </nav>
  );
}

function CategoryItems({ categories }: { categories: Category[] }) {
  return categories.map(({ name, icon }, i) => (
    <NavigationMenu.Item className="pt-4" key={i}>
      <Link href={icon} legacyBehavior passHref>
        <NavigationMenu.Link className="flex w-32 flex-col items-center justify-center self-center text-center">
          <Image alt={"test"} height={30} src={categoryLogo} width={30} />
          {name}
        </NavigationMenu.Link>
      </Link>
    </NavigationMenu.Item>
  ));
}

type ScrollButtonProps = {
  onClick: (_: boolean) => void;
  goLeft?: boolean;
};

function ScrollButton({ onClick, goLeft = false }: ScrollButtonProps) {
  return (
    <div className="flex self-center">
      <button
        className="h-8 w-8 rounded-full bg-red-800 hover:scale-125 hover:shadow"
        onClick={() => onClick(goLeft)}
      >
        {goLeft ? "<" : ">"}
      </button>
    </div>
  );
}
