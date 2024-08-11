'use client'

import Profile from "@/components/navbar/actions/profile";
import Links from "@/components/navbar/actions/links";
import { useState } from "react";
import Hamburger from 'hamburger-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Drawer } from 'vaul';

type MenuProps = {
  className?: string
}

export default function Menu({ className }: MenuProps) {
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
