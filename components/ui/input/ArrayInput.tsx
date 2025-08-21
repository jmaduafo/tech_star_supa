"use client";
import React, { useState } from "react";
import Input from "./Input";
import { X } from "lucide-react";
import CustomInput from "./CustomInput";

type Input = {
  readonly label: string;
  readonly htmlFor: string;
  readonly setInputs: React.Dispatch<React.SetStateAction<string[]>>;
  readonly inputs: string[];
  readonly disabledLogic?: boolean;
  readonly children?: React.ReactNode;
  readonly hideX?: boolean;
};

function ArrayInput({
  label,
  htmlFor,
  setInputs,
  inputs,
  disabledLogic,
  children,
  hideX,
}: Input) {
  const [value, setValue] = useState("");

  function handleAddInput() {
    if (value.length && isNaN(+value)) {
      setInputs([...new Set([...inputs, value.toLowerCase().trim()])]);
      setValue("");
    }
  }

  function deleteInput(item: string) {
    setInputs(inputs.filter((inp) => inp !== item));
  }

  return (
    <div className="my-4">
      <div className="flex items-center gap-2 flex-wrap mb-2">
        {inputs.map((item) => {
          return (
            <div
              key={item}
              className="flex items-center gap-2 py-0.5 px-3 text-[13.5px] bg-darkText text-lightText rounded-full"
            >
              <p className="capitalize whitespace-nowrap">{item}</p>
              {!hideX ? (
                <button
                  className="hover:bg-lightText hover:text-darkText rounded-full duration-300"
                  type="button"
                  onClick={() => deleteInput(item)}
                >
                  <X className="w-3 h-3" />
                </button>
              ) : null}
            </div>
          );
        })}
      </div>
      <CustomInput htmlFor={htmlFor} label={label}>
        <input
          className="form"
          type="text"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddInput();
            }
          }}
          onChange={(e) => setValue(e.target.value)}
          value={value}
          id={htmlFor}
        />
      </CustomInput>
      {children}
      {/* CLICK BUTTON TO ADD INPUT TO ARRAY */}
      <div className="flex justify-end">
        <button
          type="button"
          className={`mt-2 py-1 px-4 rounded-md border-none outline-none bg-darkText ${
            disabledLogic ? "opacity-50" : "hover:opacity-50"
          } duration-300`}
          onClick={handleAddInput}
          disabled={disabledLogic}
        >
          + Add
        </button>
      </div>
    </div>
  );
}

export default ArrayInput;
