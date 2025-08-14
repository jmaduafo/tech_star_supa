import React from "react";

function Loading({ className }: { readonly className?: string }) {
  return (
    <div
      className={`rounded-full border-transparent border-t-lightText border-[3px] animate-spin ${
        className ?? "w-8 h-8"
      }`}
    ></div>
  );
}

export default Loading;
