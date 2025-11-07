"use client";
import TextButton from "@/components/ui/buttons/TextButton";
import React, { useEffect, useState } from "react";
import NotAvailable from "@/components/ui/NotAvailable";
import Loading from "@/components/ui/loading/Loading";
import { Amount, ChartData, Project, User } from "@/types/types";
import PieChart2 from "@/components/ui/charts/PieChart2";

function PieChartDisplay({
  projects,
  currencies,
  user,
}: {
  readonly projects: Project[] | undefined;
  readonly currencies: Amount[] | undefined;
  readonly user: User | undefined;
}) {
  const [data, setData] = useState<ChartData[] | undefined>();

  const getData = async () => {
    if (!user || !projects) {
      return;
    }

    const chart: ChartData[] = [];

    projects.forEach((item) => {
      chart.push({ name: item.name, value: item.contractors?.length ?? 0 });
    });

    setData(chart);
  };

  useEffect(() => {
    getData();
  }, [user, projects]);

  const chartRender = data?.length ? (
    <div className="w-full h-full">
      <PieChart2 data={data} />
      <p className="text-center text-[14.5px]">Contractor Count per Project</p>
    </div>
  ) : (
    <div className={`h-full flex items-center justify-center`}>
      <NotAvailable text="No projects available for pie chart data" />
    </div>
  );

  return (
    <div className="h-full">
      {data?.length ? (
        <div className="flex justify-end">
          <TextButton href="/reports" text="See more" iconDirection="right" />
        </div>
      ) : null}
      {data ? (
        chartRender
      ) : (
        <div className="h-full flex justify-center items-center">
          <Loading />
        </div>
      )}
    </div>
  );
}

export default PieChartDisplay;
