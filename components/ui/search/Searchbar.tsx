"use client"
import React, {useEffect, useRef } from "react";
import { Search } from "lucide-react";

function Searchbar({
  setValue,
  value,
  open,
  setOpen,
  // children,
  handleSearch,
}: {
  readonly setValue: React.Dispatch<React.SetStateAction<string>>;
  readonly handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readonly value: string;
  readonly open: boolean;
  readonly setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  // readonly children: React.ReactNode;
}) {
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // THE OPTION LIST CLOSES WHEN USER CLICKS OUT OF SEARCH BAR
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={`z-50 relative bg-light50 backdrop-blur-lg px-2 py-1.5 rounded-xl
      }`}
    >
      <div ref={searchRef} className="flex items-center gap-1 relative">
        <Search className="w-5 text-darkText" />
        <input
          value={value}
          onChange={handleSearch}
          type="text"
          placeholder="Search by project name or location"
          className="placeholder-dark50 text-[15px] py-0"
        />
      </div>
    </div>
  );
}

export default Searchbar;
