import React from "react";

function PrimaryButton({
  children,
  action,
}: {
  readonly children: React.ReactNode;
  readonly action?: () => void;
}) {

  return (
    <button
      onClick={action}
      className="flex gap-1.5 items-center font-light text-lightText bg-darkText hover:bg-darkText/80 duration-300 px-6 py-2.5 rounded-full"
    >
      {children}
    </button>
  );
}

export default PrimaryButton;
