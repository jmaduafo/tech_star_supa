import { CircleCheck } from "lucide-react";
import React from "react";

function CheckedButton({
  clickedFn,
  disabledLogic,
  className,
}: {
  readonly clickedFn: () => void;
  readonly disabledLogic?: boolean;
  readonly className?: string;
}) {
  return (
    <button
      onClick={clickedFn}
      disabled={disabledLogic}
      title="Filter"
      className={`rounded-full ${
        disabledLogic
          ? "opacity-50 cursor-not-allowed"
          : "opacity-100 cursor-pointer hover:bg-lightText text-lightText hover:text-darkText duration-300"
      }`}
    >
      <CircleCheck strokeWidth={1} className="w-6 h-6" />
    </button>
  );
}

export default CheckedButton;
