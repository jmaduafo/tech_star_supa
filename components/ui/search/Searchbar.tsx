"use client";
import React, { useRef } from "react";
import { CornerDownLeft, Search } from "lucide-react";
import Paragraph from "@/components/fontsize/Paragraph";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

function Searchbar({
  setValue,
  value,
  open,
  setOpen,
}: 
{
  readonly setValue: React.Dispatch<React.SetStateAction<string>>;
  readonly value: string;
  readonly open: boolean;
  readonly setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const searchRef = useRef<HTMLDivElement>(null);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();


  function handleSearch(
    e: React.KeyboardEvent<HTMLInputElement>,
  ) {
    const params = new URLSearchParams(searchParams);

    if (e.key === "Enter") {
      value.length ? params.set("query", value) : params.delete("query");
  
      !value.length ? setOpen(false) : setOpen(true);
  
      replace(`${pathname}?${params.toString()}`);
    }
  }

  return (
    <div
      className={`z-50 relative flex justify-between items-center gap-3 bg-light35 backdrop-blur-lg px-1.5 py-1 rounded-xl
      }`}
    >
      <div ref={searchRef} className="flex items-center gap-1 flex-1">
        <Search className="w-5 text-darkText" />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleSearch}
          type="text"
          placeholder="Search by project name or location"
          className="placeholder-dark50 text-sm py-0"
        />
      </div>
      <div className="h-full px-2 py-0.5 flex gap-1.5 justify-center items-center bg-lightText/70 text-darkText rounded-md">
        <CornerDownLeft strokeWidth={1.2} className="w-3.5 h-3.5" />
        <Paragraph text="Enter" className="font-light" />
      </div>
    </div>
  );
}

export default Searchbar;
