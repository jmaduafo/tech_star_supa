import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Calendar } from "../calendar";
import { DateRange } from "react-day-picker";
import { ChevronDownIcon } from "lucide-react";

function CustomDate({
  dateRange,
  setDateRange,
}: {
  readonly dateRange: DateRange | undefined;
  readonly setDateRange: React.Dispatch<
    React.SetStateAction<DateRange | undefined>
  >;
}) {
  const [dropdown] =
    useState<React.ComponentProps<typeof Calendar>["captionLayout"]>(
      "dropdown"
    );
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex gap-1 items-center font-light text-darkText bg-lightText/60 hover:bg-lightText/80 duration-300 px-6 py-2.5 rounded-full">
          {dateRange?.from && dateRange?.to
            ? dateRange.from.toLocaleDateString() +
              " - " +
              dateRange.to.toLocaleDateString()
            : "Select date"}
          <ChevronDownIcon strokeWidth={1} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="end">
        <Calendar
          mode="range"
          defaultMonth={dateRange?.from}
          selected={dateRange}
          onSelect={setDateRange}
          numberOfMonths={2}
          captionLayout={dropdown}
          disabled={(date) => date > new Date()}
          className="rounded-lg border shadow-sm"
        />
      </PopoverContent>
    </Popover>
  );
}

export default CustomDate;
