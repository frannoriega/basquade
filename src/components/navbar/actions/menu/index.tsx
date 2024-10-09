'use client'

import Profile from "@/components/navbar/actions/profile";
import Links from "@/components/navbar/actions/links";
import { useState } from "react";
import Hamburger from 'hamburger-react';
import { Drawer } from 'vaul';

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
          <Drawer.Content className="z-50 max-w-[66.66667%] bg-white flex flex-col gap-8 rounded-t-[10px] h-full p-8 w-[400px] mt-24 fixed bottom-0 right-0">
            <Profile />
            <Links listClassName="flex flex-col items-start" />
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  )
}
