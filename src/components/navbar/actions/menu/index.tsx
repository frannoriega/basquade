'use client'

import Profile from "@/components/navbar/actions/profile";
import * as Separator from "@radix-ui/react-separator";
import Links from "@/components/navbar/actions/links";
import { useState } from "react";
import Hamburger from 'hamburger-react';
import { Drawer } from 'vaul';
import ThemeButton from "../../theme-button";

type MenuProps = {
  className?: string
}

export default function Menu({ className }: MenuProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className={className}>
      <Drawer.Root direction="right" open={open} onOpenChange={setOpen}>
        <Drawer.Trigger asChild><Hamburger size={24} toggled={open} toggle={setOpen} /></Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Content className="z-50 max-w-[66.66667%] bg-gray-100 dark:bg-gray-800 flex flex-col rounded-t-[10px] h-full w-[400px] mt-24 fixed bottom-0 right-0">
            <Profile />
            <Links listClassName="flex flex-col items-start p-4" />
            <Separator.Root decorative className="self-center w-2/3 h-px bg-gray-700 dark:bg-gray-400" orientation="horizontal"/>
            <div className="flex flex-row justify-between p-4">
              <span>Cambiar tema</span>
              <ThemeButton />
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  )
}
