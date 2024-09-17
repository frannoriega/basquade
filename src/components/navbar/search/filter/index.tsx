
import React, { ForwardedRef } from 'react';
import * as Select from '@radix-ui/react-select';
import { cn } from "@/lib/utils";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';

class Section {
  readonly value: string;
  readonly display: string;

  constructor(value: string, display: string) {
    this.value = value;
    this.display = display;
  }
}

const sections = [
  new Section("*", "Todas"),
  new Section("agro", "Agroecología"),
  new Section("sentences", "Sentencias")
]

export default function Filter() {
  return <Select.Root>
    <Select.Trigger className="outline-0 flex flex-row gap-2 bg-green-200 items-center justify-center p-2 min-h-fit g-4 rounded-s-md text-violet-500 text-sm hover:bg-red-300 min-w-max" aria-label="Food">
      <Select.Value placeholder={sections[0].display}/>
      <Select.Icon className="text-green-600">
        <ChevronDownIcon />
      </Select.Icon>
      <Select.Content className="z-50 w-48">
        <Select.ScrollUpButton>
          <ChevronUpIcon />
        </Select.ScrollUpButton>
        <Select.Viewport className="p-4 bg-green-100 rounded-md min-w-52 w-52 z-50">
          {sections.map(s =>
            <SelectItem key={s.value} value={s.value} className='hover:bg-green-600 min-w-50'>
              {s.display}
            </SelectItem>
          )}
        </Select.Viewport>
        <Select.ScrollDownButton>
          <ChevronDownIcon />
        </Select.ScrollDownButton>
      </Select.Content>
    </Select.Trigger>
  </Select.Root>
};

type SelectItemProps = React.ComponentPropsWithRef<"input">;

const SelectItem = React.forwardRef(({ children, className, value, ...props }: SelectItemProps, forwardedRef: ForwardedRef<HTMLDivElement>) => {
  return (
    <Select.Item className={cn('flex items-center flex-row select-none', className)} value={`${value}`} {...props} ref={forwardedRef}>
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator>
        <CheckIcon className='ms-2' />
      </Select.ItemIndicator>
    </Select.Item>
  );
});
