"use client";

import Header5 from "@/components/fontsize/Header5";
import VerticalBarChart from "@/components/ui/charts/VerticalBarChart";
import Loading from "@/components/ui/loading/Loading";
import { Project } from "@/types/types";
import { topContractors } from "@/utils/chartHelpers";
import { sortByNumOrBool } from "@/utils/sortFilter";
import React, { useEffect, useState } from "react";

function TopContractors({
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
    if (
      !selectedProject.length ||
      !selectedCurrency.length ||
      !projects ||
      !period.length
    ) {
      return;
    }

    const project = projects.find((item) => item.id === selectedProject);

    if (!project) {
      return;
    }

    if (project.contractors) {
      const list = topContractors(
        project.contractors,
        selectedCurrency,
        period,
        customStart,
        customEnd
      );

      const top = sortByNumOrBool(list, "amount", "desc");
      setData(top);
    }
  };

  useEffect(() => {
    getData();
  }, [
    projects,
    selectedProject,
    selectedCurrency,
    period,
    customStart,
    customEnd,
  ]);

  return (
    <div className="h-full">
      {data ? (
        <div className="flex flex-col gap-3 h-full w-full">
          <div className="flex items-start gap-2.5">
            <Header5 text="Top Paid Contractors" />
            <p className="text-xs -translate-y-1">Max. 5</p>
          </div>
          <div className="mt-auto h-[25vh] xl:h-[60%] w-full">
            <VerticalBarChart
              data={data}
              format
              code={selectedCurrency}
              dataArray={["amount"]}
              maxSize={50}
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

export default TopContractors;
