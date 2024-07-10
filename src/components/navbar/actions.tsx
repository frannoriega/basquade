'use client'

import cn from "@/lib/utils";
import { useState, useRef, RefObject } from "react";
import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@radix-ui/react-navigation-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Hamburger from 'hamburger-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Drawer } from 'vaul';

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
  const [open, setOpen] = useState(false);
  return (
    <div className={className}>
      <Drawer.Root direction="right" open={open} onOpenChange={setOpen}>
        <Drawer.Trigger><Hamburger toggled={open} toggle={setOpen} /></Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Content className="bg-white flex flex-col gap-8 rounded-t-[10px] h-full p-8 w-[400px] mt-24 fixed bottom-0 right-0">
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger><Profile /></AccordionTrigger>
                <AccordionContent>
                  Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Links listClassName="flex flex-col items-start" />
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  )
}
