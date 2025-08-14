import React from "react";

type Input = {
  readonly children: React.ReactNode;
  readonly handleAdd: () => void;
  readonly disabledLogic?: boolean;
};

function ObjectArray({ children, handleAdd, disabledLogic }: Input) {
  return (
    <div className="my-4">
      {children}
      {/* CLICK BUTTON TO ADD INPUT TO ARRAY */}
      <div className="flex justify-end">
        <button
          type="button"
          className={`mt-2 py-1 px-4 rounded-md border-none outline-none bg-darkText ${
            disabledLogic ? "opacity-50" : "hover:opacity-50"
          } duration-300`}
          onClick={handleAdd}
          disabled={disabledLogic}
        >
          + Add
        </button>
      </div>
    </div>
  );
}

export default ObjectArray;
