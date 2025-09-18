"use client";

import Header6 from "@/components/fontsize/Header6";
import CardSkeleton from "@/components/ui/cards/CardSkeleton";
import PieChart2 from "@/components/ui/charts/PieChart2";
import SelectBar from "@/components/ui/input/SelectBar";
import Loading from "@/components/ui/loading/Loading";
import { SelectItem } from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { Project, StageContractor, User } from "@/types/types";
import { contractorPieStageChart } from "@/utils/chartHelpers";
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
  const [value, setValue] = useState("Stages");
  const [data, setData] = useState<any[] | undefined>();

  const supabase = createClient();

  const getData = async () => {
    if (!project_id.length || !user) {
      return;
    }

    const { data } = await supabase
      .from("stage_contractors")
      .select(" id, stages ( id, name ), contractors ( id, name )")
      .eq("contractors.team_id", user.team_id)
      .throwOnError();

    const chart = contractorPieStageChart(data as StageContractor[]);
    setData(chart);
  };

  useEffect(() => {
    getData();
  }, [user, project_id]);

  return (
    <div className="h-full">
      {!data ? (
        <div className="h-full w-full flex justify-center items-center">
          <Loading />
        </div>
      ) : (
        <div className="flex flex-col items-center h-full w-full">
          <SelectBar
            placeholder={""}
            label={""}
            value={value}
            valueChange={setValue}
            className="w-full"
          >
            {["Stages", "Projects"].map((item) => {
              return (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              );
            })}
          </SelectBar>
          <div className="mt-auto w-full min-h-[35vh]">
            <PieChart2 data={data} dataKey="contractorCount" />
          </div>
          <div className="mt-auto">
            <Header6 text={`Contractors Count vs ${value}`}/>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContractorPie;
