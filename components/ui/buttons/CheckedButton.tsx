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
      className={`rounded-full ${disabledLogic ? "opacity-50" : "opacity-100"}`}
    >
      <CircleCheck strokeWidth={1} className="text-lightText w-6 h-6" />
    </button>
  );
}

export default CheckedButton;
