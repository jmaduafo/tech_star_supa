"use client";

import AreaChart from "@/components/ui/charts/AreaChart";
import ChartHeading from "@/components/ui/labels/ChartHeading";
import Loading from "@/components/ui/loading/Loading";
import { Project } from "@/types/types";
import { contractPaymentsAreaChart } from "@/utils/chartHelpers";
import { switchPeriod } from "@/utils/dateAndTime";
import React, { useEffect, useState } from "react";

function ContractPaymentArea({
  timePeriod,
  currency_symbol,
  project_id,
  currency_code,
  projects,
}: {
  readonly timePeriod: string;
  readonly project_id: string;
  readonly currency_code: string;
  readonly currency_symbol: string;
  readonly projects: Project[] | undefined;
}) {
  const [data, setData] = useState<any[] | undefined>();

  const getData = () => {
    if (!projects || !project_id.length || !currency_code.length) {
      return;
    }

    console.log(project_id);
    console.log(currency_code);

    const chart = contractPaymentsAreaChart(
      projects,
      project_id,
      currency_code,
      switchPeriod(timePeriod)
    );

    setData(chart);
  };

  useEffect(() => {
    getData();
  }, [timePeriod, project_id, currency_code]);

  return (
    <div className="h-full w-full">
      {!data ? (
        <div className="w-full h-full flex justify-center items-center">
          <Loading />
        </div>
      ) : (
        <div className="h-full w-full">
          <ChartHeading
            text="Contracts vs Contract Payments"
            subtext="Recording of contract amounts and paid contract payments over time"
          />
          <div className="h-[35vh] w-full">
            <AreaChart
              data={data}
              format
              code={currency_code}
              dataKeys={["contracts", "payments"]}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ContractPaymentArea;
