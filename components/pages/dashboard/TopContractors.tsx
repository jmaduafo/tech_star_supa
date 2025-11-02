"use client"

import Header5 from "@/components/fontsize/Header5";
import SelectBar from "@/components/ui/input/SelectBar";
import { SelectItem } from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { Contractor } from "@/types/types";
import { currency_list } from "@/utils/dataTools";
import React, { useState } from "react";

function TopContractors() {
    const [ data, setData ] = useState<Contractor[] | undefined>()
    const supabase = createClient()


  return (
    <div>
      <div className="flex items-start gap-2.5">
        <Header5 text="Top Paid Contractors" />
        <p className="text-xs -translate-y-1">Max. 5</p>
      </div>
      <SelectBar
        placeholder={"Select a currency"}
        label={"Currencies"}
        className="mt-2 max-w-20"
      >
        {currency_list.map((item) => {
          return (
            <SelectItem key={item.code} value={item.code}>
              {item.code}
            </SelectItem>
          );
        })}
      </SelectBar>

    </div>
  );
}

export default TopContractors;
