"use client";

import SelectBar from "@/components/ui/input/SelectBar";
import { SelectItem } from "@/components/ui/select";
import React, { useState } from "react";

function ContractorPie() {
  const [value, setValue] = useState("");
  return (
    <div>
      <SelectBar
        placeholder={""}
        label={""}
        value={value}
        valueChange={setValue}
        className="w-full"
      >
        <SelectItem value="hi"></SelectItem>
      </SelectBar>
    </div>
  );
}

export default ContractorPie;
