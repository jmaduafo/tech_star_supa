"use client";

import Header5 from "@/components/fontsize/Header5";
import BarChart from "@/components/ui/charts/BarChart";
import SelectBar from "@/components/ui/input/SelectBar";
import Loading from "@/components/ui/loading/Loading";
import NotAvailable from "@/components/ui/NotAvailable";
import { SelectItem } from "@/components/ui/select";
import { Project } from "@/types/types";
import { contractPaymentsAreaChart } from "@/utils/chartHelpers";
import { switchPeriod } from "@/utils/dateAndTime";
import React, { useEffect, useState } from "react";

function AmountsBar({
  projects,
  selectedCurrency,
  selectedProject,
}: {
  readonly projects: Project[] | undefined;
  readonly selectedProject: string;
  readonly selectedCurrency: string;
}) {
  const [data, setData] = useState<any[] | undefined>();
  const [period, setPeriod] = useState("Weekly");

  const getData = () => {
    if (!projects || !selectedCurrency.length || !selectedProject.length) {
      return;
    }

    const chart = contractPaymentsAreaChart(
      projects,
      selectedProject,
      selectedCurrency,
      switchPeriod(period)
    );

    chart ? setData(chart) : setData(undefined);
    console.log(chart);
  };

  useEffect(() => {
    getData();
  }, [selectedCurrency, selectedProject, period]);

  return (
    <div className="h-full w-full">
      <div className="h-full w-full flex flex-col">
        <div>
          <Header5 text="Revised Contract vs Contract Payment" />
          <SelectBar
            placeholder={"Select a time period"}
            label={"Period"}
            value={period}
            valueChange={setPeriod}
            className="mt-1.5 max-w-36"
          >
            {["Weekly", "Monthly", "Yearly", "Custom"].map((item) => {
              return (
                <SelectItem value={item} key={item}>
                  {item}
                </SelectItem>
              );
            })}
          </SelectBar>
        </div>
        {data?.length ? (
          <div className="mt-auto h-[70%] w-full">
            <BarChart
              data={data}
              dataArray={["contracts", "payments"]}
              code={selectedCurrency}
              format
            />
          </div>
        ) : (
            null
        )}

        {data && !data.length ? (
          <div className="h-[70%] w-full flex justify-center item-center">
            <NotAvailable text={"No data available"} />
          </div>
        ) : (
            null
        )}
      </div>

      {data ? null : (
        <div className="flex justify-center items-center h-full w-full">
          <Loading />
        </div>
      )}
    </div>
  );
}

export default AmountsBar;
