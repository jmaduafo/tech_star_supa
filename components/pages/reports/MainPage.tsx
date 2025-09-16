"use client"

import React, { useState } from "react";
import Kpi from "./kpis/Kpi";
import Tables from "./tables/Tables";
import Charts from "./charts/Charts";
import Header1 from "@/components/fontsize/Header1";
import SelectBar from "@/components/ui/input/SelectBar";
import { SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useAuth } from "@/context/UserContext";

function MainPage() {
  const [period, setPeriod] = useState("All Time");
  const { userData } = useAuth()

  return (
    <div className="">
      <div className="flex justify-between">
        <Header1 text={`${period !== "All Time" ? period + " " : ""}Report`} />
        <div className="flex gap-2">
          <SelectBar
            placeholder={"Select a time period"}
            label={"Ranges"}
            value={period}
            valueChange={setPeriod}
          >
            {["All Time", "Yearly", "Monthly", "Weekly"].map((item) => {
              return (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              );
            })}
          </SelectBar>
          <Button>
            <Download className="" />
            Download
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-4 mt-8">
        <Kpi timePeriod={period} user={userData}/>
        <Charts timePeriod={period} user={userData}/>
        <Tables timePeriod={period} user={userData}/>
      </div>
    </div>
  );
}

export default MainPage;
