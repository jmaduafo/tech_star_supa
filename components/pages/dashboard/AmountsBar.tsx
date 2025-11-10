"use client";

import BarChart from "@/components/ui/charts/BarChart";
import ChartHeading from "@/components/ui/labels/ChartHeading";
import Loading from "@/components/ui/loading/Loading";
import NotAvailable from "@/components/ui/NotAvailable";
import { Project } from "@/types/types";
import { contractPaymentsAreaChart } from "@/utils/chartHelpers";
import React, { useEffect, useState } from "react";

function AmountsBar({
  projects,
  selectedCurrency,
  selectedProject,
  period,
  customStart,
  customEnd,
}: {
  readonly projects: Project[] | undefined;
  readonly selectedProject: string;
  readonly selectedCurrency: string;
  readonly period: string;
  readonly customStart: string;
  readonly customEnd: string;
}) {
  const [data, setData] = useState<any[] | undefined>();

  const getData = () => {
    if (!projects) {
      return;
    }

    const chart = projects.length ? contractPaymentsAreaChart(
      projects,
      selectedProject,
      selectedCurrency,
      period,
      customStart,
      customEnd
    ) : []

    setData(chart);
  };

  useEffect(() => {
    getData();
  }, [projects, selectedCurrency, selectedProject, period, customStart, customEnd]);

  return (
    <div className="h-full w-full">
      <div className="h-full w-full flex flex-col">
        {data?.length ? (
          <>
            <div>
              <ChartHeading
                text="Revised Contracts vs Contract Payments"
                subtext="Bar chart display of payments against contracts"
              />
            </div>
            <div className="mt-auto h-[70%] w-full">
              <BarChart
                data={data}
                dataArray={["contracts", "payments"]}
                code={selectedCurrency}
                format
              />
            </div>
          </>
        ) : null}

        {data && !data.length ? (
          <div className="h-[70%] w-full flex justify-center item-center">
            <NotAvailable text={"No data available"} />
          </div>
        ) : null}
        
        {data ? null : (
          <div className="flex justify-center items-center h-full w-full">
            <Loading />
          </div>
        )}
      </div>
    </div>
  );
}

export default AmountsBar;
