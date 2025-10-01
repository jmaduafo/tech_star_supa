import { cn } from "@/lib/utils";
import React from "react";

function Loading({ className }: { readonly className?: string }) {
  return (
    <div
      className={cn(
        "rounded-full border-transparent border-t-darkText border-[3px] animate-spin w-8 h-8",
        className
      )}
    ></div>
  );
}

export default Loading;
