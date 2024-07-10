'use client'

import cn from "@/lib/utils";
import { useState, useRef } from "react";
import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@radix-ui/react-navigation-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerPortal,
  DrawerOverlay
} from "@/components/ui/drawer";
import Hamburger from 'hamburger-react';
import useOnClickOutside from "@/lib/events";

export default function Actions() {
  return (
    <>
      <div className="flex-row hidden md:flex md:gap-8 gap-6 items-center">
        <Links />
        <VLine />
        <Profile />
      </div>
      <Menu className="md:hidden" />
    </>
  );
}

type LinksProps = {
  className?: string
  listClassName?: string
}

function Links({ className, listClassName }: LinksProps) {
  const lcn = cn("flex flex-row gap-8 items-center", listClassName)
  return (
    <NavigationMenu className={className}>
      <NavigationMenuList className={lcn}>
        <NavigationMenuItem className="md:w-16 text-center">
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
      </NavigationMenuList>
    </NavigationMenu>
  )

}
function VLine() {
  return (
    <div className="relative">
      <div className="absolute top-[-32px] bg-slate-300 w-[1px] h-8 block translate-x-2/4 translate-y-2/4">
      </div>
    </div>
  )
}

function Profile() {
  return (
    <div className="flex flex-row">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </div>
  );
}
type MenuProps = {
  className?: string
}

function Menu({ className }: MenuProps) {
  const [isOpen, setOpen] = useState(false);
  const ref = useRef();
  const close = () => {
    console.log("close");
    setOpen(false)};
  useOnClickOutside(ref, close);
  return (
    <div className={className}>
      <Hamburger toggled={isOpen} toggle={setOpen}/>
      {/* TODO: Esto no debe ser accesible ni a patada. */ }
      <div onFocus={close} className={`${!isOpen ? "hidden" : "block"} z-10 absolute backdrop-blur w-full h-full top-0 right-0`}>
      </div>
      {/* TODO: Hay que hacer una animacion mas linda */ }
      <div ref={ref} className={`${!isOpen ? "hidden" : "block"} z-20 absolute bg-slate-50 w-1/2 h-screen top-0 right-0 p-8 flex flex-col gap-8`}>
        <Profile/>
        <Links listClassName="flex flex-col items-start"/>
      </div>
    </div>
  );
}
