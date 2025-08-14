import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

function MultipleSelectBar({
  children,
  className,
  value,
}: {
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly value: string;
}) {
    
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="rounded-xl h-9 gap-9 bg-light40 font-normal"
        >
          {value}
          <ChevronDown className="text-dark75" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[180px]">
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default MultipleSelectBar;
