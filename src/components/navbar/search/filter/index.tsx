
import React, { ForwardedRef } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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

const Filter = React.forwardRef<
  React.ElementRef<typeof Select>,
  React.ComponentPropsWithoutRef<typeof Select>>((props, ref) => {
  return <Select {...props}>
    <SelectTrigger ref={ref} className="w-48 h-full flex flex-row gap-4 bg-green-200 items-center justify-between p-4 min-h-fit rounded-s-md text-violet-500 text-sm hover:bg-red-300" aria-label="Filtro">
      <SelectValue placeholder={sections[0].display}/>
    </SelectTrigger>
    <SelectContent className="">
      {sections.map(s =>
        <SelectItem key={s.value} value={s.value} className='hover:bg-green-600'>
          {s.display}
        </SelectItem>
      )}
    </SelectContent>
  </Select>
});

export default Filter
