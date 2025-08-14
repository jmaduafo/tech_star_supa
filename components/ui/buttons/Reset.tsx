import { RefreshCw } from "lucide-react";
import React from "react";

function Reset({
  clickedFn,
  disabledLogic,
}: {
  readonly clickedFn: () => void;
  readonly disabledLogic?: boolean;
}) {
  return (
    <button
      title="Reset"
      onClick={clickedFn}
      disabled={disabledLogic}
      className={`rounded-full ${disabledLogic ? "opacity-50" : "opacity-100"}`}
    >
      <RefreshCw strokeWidth={1} className="text-lightText w-6 h-6" />
    </button>
  );
}

export default Reset;
