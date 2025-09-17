import SelectBar from "@/components/ui/input/SelectBar";
import { SelectItem } from "@/components/ui/select";
import { User } from "@/types/types";
import React, { useState } from "react";

function ContractorPayments({
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
      className="w-[40%]"
    >
      <SelectItem value="hi"></SelectItem>
    </SelectBar>
  );
}

export default ContractorPayments;
