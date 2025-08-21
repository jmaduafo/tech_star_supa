"use client";
import React from "react";

function IconTextButton({
  icon,
  text,
  path,
}: {
  readonly icon: React.ReactNode;
  readonly text: string;
  readonly path: string;
}) {
  return (
    <button
      title={text}
      className={`${
        path.toLowerCase() === text.toLowerCase()
          ? "bg-light85"
          : "bg-transparent"
      } text-darkText flex items-center text-base xs:text-sm sm:text-base gap-2 px-3 sm:px-6 py-2 rounded-full group duration-300 hover:bg-light85`}
    >
      <span>{icon}</span>
      <span className="hidden md:block">{text}</span>
    </button>
  );
}

export default IconTextButton;
