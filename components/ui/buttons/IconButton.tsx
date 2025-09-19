import React from "react";

function IconButton({
  children,
  title,
}: {
  readonly children: React.ReactNode;
  readonly title: string;
}) {
  return (
    <button
      className="bg-lightText/70 hover:bg-lightText text-darkText rounded-full p-2 duration-300"
      title={title}
    >
      {children}
    </button>
  );
}

export default IconButton;
