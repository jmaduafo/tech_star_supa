"use client";
import React, { useState } from "react";
import { User } from "@/types/types";
import Searchbar from "@/components/ui/search/Searchbar";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../dropdown-menu";
import { Button } from "../button";
import { ListFilter } from "lucide-react";

function AdvancedSearch({
  user,
  setSort,
  value,
  sort,
  setValue,
}: {
  readonly user: User | undefined;
  readonly setSort: React.Dispatch<React.SetStateAction<string>>;
  readonly sort: string;
  readonly setValue: React.Dispatch<React.SetStateAction<string>>;
  readonly value: string;
}) {
  const [open, setOpen] = useState(false);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const sortArray = [
    {
      // IF THE PROJECT IS ACTIVE OR NOT
      title: "Status",
      search: "status",
      sortStyle: null,
      type: null,
    },
    {
      // IF THE PROJECT IS ACTIVE OR NOT
      title: "Relevance",
      search: "relevance",
      sortStyle: null,
      type: null,
    },
    {
      title: "Name",
      search: "name:asc",
      sortStyle: "A to Z",
      type: "asc",
    },
    {
      title: "Name",
      search: "name:desc",
      sortStyle: "Z to A",
      type: "desc",
    },
  ];

  function handleSort(name: string) {
    const params = new URLSearchParams(searchParams);

    if (name && name !== "reset") {
      const sortBy = name.split(":");

      if (sortBy.length < 2) {
        params.set("sort", name);
        params.delete("type");
      } else {
        params.set("sort", sortBy[0]);
        params.set("type", sortBy[1]);
      }
    } else {
      params.delete("sort");
      params.delete("type");
    }

    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <section>
      <div className="flex items-center gap-1.5 z-50">
        <div className="flex-1 md:flex-none md:w-1/2">
          <Searchbar
            setOpen={setOpen}
            setValue={setValue}
            value={value}
            open={open}
          />
        </div>
        <div className="">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <ListFilter className="" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuLabel>Sort By</DropdownMenuLabel>
              <DropdownMenuGroup>
                {sortArray.map((item) => {
                  return (
                    // Format example => name:asc => Name: A to Z
                    <DropdownMenuItem
                      key={item.search}
                      onClick={() => handleSort(item.search)}
                    >
                      {item.title}
                      {item.sortStyle ? ":" : ""}
                      {item.sortStyle ? ` ${item.sortStyle}` : ""}
                    </DropdownMenuItem>
                  );
                })}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleSort("reset")}>
                  Reset
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </section>
  );
}

export default AdvancedSearch;
