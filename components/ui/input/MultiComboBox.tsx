"use client";

import React, { Fragment, useState } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
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

function MultiComboBox({
  name,
  array,
  selectedArray,
  setSelectedArray,
}: {
  readonly name: string;
  // MultiSelect[]: {label: string; value: string}[]

  // array: Array of all values that user can choose from
  readonly array: MultiSelect[] | undefined;
  // selectedArray: New array of only the selected values
  readonly selectedArray: MultiSelect[];
  readonly setSelectedArray: React.Dispatch<
    React.SetStateAction<MultiSelect[]>
  >;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          // onClick={() => setOpen(true)}
          className="w-full justify-between py-6"
        >
          {/* Styling of the selected items for users to view */}
          {selectedArray.length ? (
            <span className="flex flex-wrap gap-1 items-center">
              {selectedArray.map((item) => {
                return (
                  <span
                    key={item.value}
                    className="py-0.5 px-3 bg-darkText text-lightText h-full rounded-full whitespace-nowrap"
                  >
                    <p className="text-[12.5px] flex items-center gap-2 font-light">
                      {item.label}
                      <span
                        role="button"
                        tabIndex={0}
                        className="hover:bg-lightText hover:text-darkText rounded-full duration-300 "
                        onClick={() =>
                          setSelectedArray((prev) =>
                            prev.filter((sel) => sel.value !== item.value)
                          )
                        }
                      >
                        <X size={12} strokeWidth={1} />
                      </span>
                    </p>
                  </span>
                );
              })}
            </span>
          ) : (
            <span>Select {name}...</span>
          )}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full p-0 z-[3000] relative"
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <Command className="">
          <CommandInput placeholder="Search items..." className="h-9" />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup className="cursor-pointer">
              {/* Display of all options in the combobox */}
              {array
                ? array.map((item, i) => (
                    <Fragment key={item.value}>
                      <ToggleItem
                        item={item}
                        selectedArray={selectedArray}
                        setSelectedArray={setSelectedArray}
                        array={array}
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

export default MultiComboBox;

const ToggleItem = ({
  item,
  selectedArray,
  setSelectedArray,
  array,
}: {
  readonly array: MultiSelect[];
  readonly item: MultiSelect;
  readonly selectedArray: MultiSelect[];
  readonly setSelectedArray: React.Dispatch<
    React.SetStateAction<MultiSelect[]>
  >;
}) => {
  const [value, setValue] = useState("");

  const handleToggle = (currentValue: string, value: string) => {
    // SEARCH LOGIC
    if (array) {
      // Search array for values where the label matches what the user types in
      const obj = array.find(
        (sel) => sel.label.toLowerCase() === currentValue
      )?.value;

      obj && setValue(obj);
    }

    // CHECK/SELECT LOGIC

    // Find the entered value in the selectedArray array
    let checkArray = selectedArray.find((sel) => sel.value === value);

    if (checkArray) {
      // If value is already in the array, remove the value from the array after user click
      setSelectedArray((prev) => prev.filter((val) => val.value !== value));
    } else {
      // If value is not already in the array, append the selected item (an object) to the selectedArray array
      setSelectedArray((prev) => [...prev, item]);
    }

    // ENSURES THAT THE ARRAY IS UNIQUE EVERY TIME SO THERE ARE NO ISSUES
    // WITH KEYS
    setSelectedArray((prev) => {
      const uniqueSet = new Set(prev.map((obj) => JSON.stringify(obj)));
      return Array.from(uniqueSet).map((str) => JSON.parse(str));
    });
  };

  return (
    <CommandItem
      className="cursor-pointer"
      value={item.label}
      onSelect={(val) => {
        handleToggle(val, item.value);
      }}
    >
      {item.label}
      <Check
        className={cn(
          "ml-auto",
          // If the value is in the array, make the check visible. Else make it non-visible
          selectedArray.find((sel) => sel.value === item.value)
            ? "opacity-100"
            : "opacity-0"
        )}
      />
    </CommandItem>
  );
};
