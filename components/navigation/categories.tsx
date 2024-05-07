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
  const navRef = useRef<null | HTMLElement>(null);
  const handleNav = (goLeft: boolean) => {
    if (goLeft) {
      navRef.current ? (navRef.current.scrollLeft -= 200) : null;
    } else {
      navRef.current ? (navRef.current.scrollLeft += 200) : null;
    }
  };

  return (
    <div className="flex h-20 flex-row bg-red-400">
      <ScrollButton goLeft onClick={handleNav} />
      <NavigationMenu.Root className="flex flex-row overflow-hidden scroll-smooth" ref={navRef}>
        <NavigationMenu.List className="flex flex-row gap-4">
          <CategoryItems categories={categories} />
        </NavigationMenu.List>
      </NavigationMenu.Root>
      <ScrollButton onClick={handleNav} />
    </div>
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
