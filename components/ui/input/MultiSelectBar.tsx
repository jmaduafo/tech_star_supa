"use client";

import React, { Fragment, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { MultiSelect } from "@/types/types";

function MultiSelectBar({
  name,
  array,
  selectedArray,
  setSelectedArray,
}: {
  readonly name: string;
  readonly array: MultiSelect[] | undefined;
  readonly selectedArray: MultiSelect[];
  readonly setSelectedArray: React.Dispatch<React.SetStateAction<MultiSelect[]>>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <span>Select {name}</span>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search framework..." className="h-9" />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {array
                ? array.map((item, i) => (
                    <Fragment key={item.value}>
                      <ToggleItem
                        item={item}
                        selectedArray={selectedArray}
                        setSelectedArray={setSelectedArray}
                      />
                    </Fragment>
                  ))
                : null}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default MultiSelectBar;

const ToggleItem = ({
  item,
  selectedArray,
  setSelectedArray,
}: {
  readonly item: MultiSelect;
  readonly selectedArray: MultiSelect[];
  readonly setSelectedArray: React.Dispatch<React.SetStateAction<MultiSelect[]>>;
}) => {
  const [value, setValue] = useState("");

  const handleToggle = (currentValue: string) => {
    setValue(currentValue)

    let checkArray = selectedArray.find(sel => sel.value === value) 

    if (checkArray) {
      setSelectedArray(selectedArray.filter((val) => val.value !== currentValue));
    } else {
      setSelectedArray([...selectedArray, item]);
    }

    console.log(selectedArray)
  };

  return (
    <CommandItem
      value={item.value}
      onSelect={(val) => {
        handleToggle(val);
      }}
    >
      {item.label}
      <Check
        className={cn(
          "ml-auto",
          selectedArray.find(sel => sel.value === value) ? "opacity-100" : "opacity-0"
        )}
      />
    </CommandItem>
  );
};
