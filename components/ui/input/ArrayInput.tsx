"use client";
import React, { useState } from "react";
import Input from "./Input";
import { X } from "lucide-react";

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
  hideX
}: Input) {
  const [value, setValue] = useState("");

  function handleAddInput() {
    if (value.length) {
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
              className="flex items-center gap-1 py-1 px-4 text-[13.5px] border border-lightText rounded-full"
            >
              <p className="capitalize">{item}</p>
              {
                !hideX ?
                <button type="button" onClick={() => deleteInput(item)}>
                <X className="w-4 h-4" />
              </button>
              :
              null
              }
            </div>
          );
        })}
      </div>
      <Input htmlFor={htmlFor} label={label}>
        <input
          className="form"
          type="text"
          onChange={(e) => setValue(e.target.value)}
          value={value}
          id={htmlFor}
        />
      </Input>
      {
        children
      }
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
