"use client";

import SelectBar from "@/components/ui/input/SelectBar";
import { User } from "@/types/types";
import { SelectItem } from "@radix-ui/react-select";
import React, { useState } from "react";

function PaymentPie({
  timePeriod,
  user,
}: {
  readonly timePeriod: string;
  readonly user: User | undefined;
}) {
  const [value, setValue] = useState("");
  return (
    <SelectBar
      placeholder={""}
      label={""}
      value={value}
      valueChange={setValue}
      className="w-full"
    >
      <SelectItem value="hi"></SelectItem>
    </SelectBar>
  );
}

export default PaymentPie;
