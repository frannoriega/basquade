'use client'

import cn from "@/lib/utils";
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

export default function Actions() {
  return (
    <>
      <div className="flex-row hidden md:flex md:gap-8 gap-6 items-center">
        <Links />
        <VLine />
        <Profile />
      </div>
      <Menu className="md:hidden mt-2" />
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
  return (
    <div className={className}>
      <Drawer direction="right" snapPoints={[0.5, 1, 0]} >
        <DrawerTrigger asChild><button><Hamburger/></button></DrawerTrigger>
        <DrawerContent>
          <div className="flex flex-col gap-8 pl-4">
            <Profile/>
            <Links listClassName="flex-col items-start"/>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
