"use client";
import TextButton from "@/components/ui/buttons/TextButton";
import React, { useEffect, useState } from "react";
// import { getQueriedCount, getQueriedItems } from "@/firebase/actions";
// import { collection, query, where } from "firebase/firestore";
// import { db } from "@/firebase/config";
import { ChartConfig } from "@/components/ui/chart";
import NotAvailable from "@/components/ui/NotAvailable";
import Loading from "@/components/ui/Loading";
import PieChart from "../../ui/charts/PieChart";
import { Project, User } from "@/types/types";

type Chart = {
  project_id: string;
  project_name: string;
  contractors: number | undefined;
  fill: string;
};

function PieChartDisplay({ user }: { readonly user: User | undefined }) {
  const [chartData, setChartData] = useState<Chart[] | undefined>();
  const [loading, setLoading] = useState(false);

  let chartConfig = {
    contractors: {
      label: "Contractors",
    },
  } satisfies ChartConfig;

  // async function getChartData() {
  //   if (!user) {
  //     return;
  //   }

  //   setLoading(true);

  //   try {
  //     const projectq = query(
  //       collection(db, "projects"),
  //       where("team_id", "==", user?.team_id)
  //     );

  //     const allProjects = await getQueriedItems<Project>(projectq);

  //     // Use `map` to return an array of promises
  //     const chartPromises = allProjects.map(async (project, i) => {
  //       const contractorq = query(
  //         collection(db, "contractors"),
  //         where("project_id", "==", project?.id)
  //       );

  //       const contractorsCount = await getQueriedCount(contractorq);

  //       let info = {
  //         label: project?.name,
  //         color: `var(--amber${i + 1})`,
  //       };

  //       Object.defineProperty(chartConfig, project?.name?.toLowerCase(), {
  //         value: info,
  //         writable: true,
  //         enumerable: true,
  //         configurable: true,
  //       });

  //       return {
  //         project_id: project?.id,
  //         project_name: project?.name,
  //         contractors: contractorsCount,
  //         fill: `var(--amber${i + 1})`,
  //       };
  //     });

  //     const chart = await Promise.all(chartPromises);

  //     setChartData(chart)
  //   } catch (err: any) {
  //     console.log(err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  // useEffect(() => {
  //   getChartData();
  // }, [user?.id ?? "guest"]);

  const chartRender = chartData?.length ? (
    <div className="mt-1">
      <PieChart
        chartConfig={chartConfig}
        data={chartData}
        nameKey="project_name"
        dataKey="contractors"
      />
    </div>
  ) : (
    <div className={`h-full flex items-center justify-center`}>
      <NotAvailable text="No projects available for pie chart data" />
    </div>
  );

  return (
    <div className="h-full">
      {chartData?.length ? (
        <div className="flex justify-end">
          <TextButton href="/charts" text="See more" iconDirection="right" />
        </div>
      ) : null}
      {loading ? (
        <div className="h-full flex justify-center items-center">
          <Loading />
        </div>
      ) : (
        chartRender
      )}
    </div>
  );
}

export default PieChartDisplay;
