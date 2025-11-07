"use client";

import PieChart2 from "@/components/ui/charts/PieChart2";
import SelectBar from "@/components/ui/input/SelectBar";
import PieChartHeading from "@/components/ui/labels/PieChartHeading";
import Loading from "@/components/ui/loading/Loading";
import { SelectItem } from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { Project, StageContractor, User } from "@/types/types";
import {
  contractorPieLocationChart,
  contractorPieStageChart,
  contractorPieStartYearChart,
} from "@/utils/chartHelpers";
import React, { useEffect, useState } from "react";

function ContractorPie({
  timePeriod,
  user,
  projects,
  project_id,
}: {
  readonly timePeriod: string;
  readonly project_id: string;
  readonly projects: Project[] | undefined;
  readonly user: User | undefined;
}) {
  const [value, setValue] = useState("Stage");
  const [data, setData] = useState<StageContractor[] | undefined>();
  const [chartData, setChartData] = useState<any[] | undefined>();

  const supabase = createClient();

  const getData = async () => {
    if (!project_id.length || !user) {
      return;
    }

    const { data } = await supabase
      .from("stage_contractors")
      .select(" id, stages ( id, name ), contractors ( id, name )")
      .eq("contractors.team_id", user.team_id)
      .eq("contractors.project_id", project_id)
      .eq("stages.project_id", project_id)
      .throwOnError();

    setData(data as StageContractor[]);

    const chart = contractorPieStageChart(data as StageContractor[]);
    setChartData(chart);
  };

  useEffect(() => {
    getData();
  }, [user, projects]);

  useEffect(() => {
    if (data && projects && project_id) {
      if (value === "Stage") {
        const chart = contractorPieStageChart(data);
        setChartData(chart);
      } else if (value === "Location") {
        const chart = contractorPieLocationChart(projects, project_id);
        setChartData(chart);
      } else if (value === "Start Year") {
        const chart = contractorPieStartYearChart(projects, project_id);
        setChartData(chart);
      }
    }
  }, [project_id, value]);

  return (
    <div className="h-full">
      {chartData ? (
        <div className="flex flex-col items-center h-full w-full">
          <SelectBar
            placeholder={""}
            label={""}
            value={value}
            valueChange={setValue}
            className="w-full"
          >
            {["Stage", "Location", "Start Year"].map((item) => {
              return (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              );
            })}
          </SelectBar>
          <div className="mt-auto w-full min-h-[35vh]">
            <PieChart2 data={chartData} dataKey="count" />
          </div>
          <div className="mt-auto">
            <PieChartHeading
              text={`Contractors vs ${value}`}
              subtext={`Count of contractors based on ${value.toLowerCase()}`}
            />
          </div>
        </div>
      ) : (
        <div className="h-full w-full flex justify-center items-center">
          <Loading />
        </div>
      )}
    </div>
  );
}

export default ContractorPie;
