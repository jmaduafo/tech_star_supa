import SelectBar from '@/components/ui/input/SelectBar';
import { SelectItem } from '@/components/ui/select';
import React, { useState } from 'react'

function ContractorPayments() {
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

export default ContractorPayments