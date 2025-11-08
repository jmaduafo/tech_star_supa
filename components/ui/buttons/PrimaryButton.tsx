import React from "react";
import { useRouter } from "next/navigation";

function PrimaryButton({
  children,
  link,
}: {
  readonly children: React.ReactNode;
  readonly link?: string;
}) {
  const route = useRouter();

  return (
    <button
      onClick={() => link && route.push(link)}
      className="flex gap-1 items-center font-light text-lightText bg-darkText hover:bg-darkText/80 duration-300 px-6 py-2.5 rounded-full"
    >
      {children}
    </button>
  );
}

export default PrimaryButton;
