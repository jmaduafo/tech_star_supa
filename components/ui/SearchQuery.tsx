"use client"

import React, { useState } from 'react'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandList,
  } from "@/components/ui/command"
  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
  import { Button } from "@/components/ui/button"
  import { HiChevronDown, HiChevronUp } from "react-icons/hi2";


  type Search = {
    readonly value?: string;
    readonly dataMap?: React.ReactNode;
    readonly findData?: React.ReactNode;
  }

function SearchQuery({ value, dataMap, findData }: Search) {
    const [ open, setOpen ] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
      <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
            {/* Ex: findData: frameworks.find((framework) => framework.value === value)?.label */}
            {value
            ? findData
            : "Select framework..."}      
            {open ? <HiChevronUp className='ml-2 h-4 w-4 shrink-0 opacity-50'/> : <HiChevronDown className='ml-2 h-4 w-4 shrink-0 opacity-50'/>}    
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <>
          <CommandInput placeholder="Search framework..." />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
                {/* CommandItem */}
              {dataMap}
            </CommandGroup>
          </CommandList>
          </>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default SearchQuery