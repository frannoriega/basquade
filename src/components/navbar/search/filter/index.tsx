import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type FilterProps = {
  shelves: {
    id: number,
    name: string
  }[]
} & React.ComponentPropsWithoutRef<typeof Select>

const Filter = React.forwardRef<
  React.ElementRef<typeof Select>,
  FilterProps>((props, ref) => {
    return <Select {...props}>
      <SelectTrigger ref={ref} className="w-48 h-full flex flex-row gap-4 bg-gray-200 dark:bg-gray-900 items-center justify-between p-4 min-h-fit rounded-s-md text-gray-950 dark:text-gray-100 text-sm hover:bg-green-300 dark:hover:bg-green-900" aria-label="Filtro">
        <SelectValue placeholder="Todos" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem className='focus:bg-green-200 dark:focus:bg-green-800' value='all'>
          Todos
        </SelectItem>
        {props.shelves.map(c =>
          <SelectItem key={c.id} value={c.id.toString()} className='focus:bg-green-200 dark:focus:bg-green-800'>
            {c.name}
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  });

export default Filter
