"use client";
import TextButton from "@/components/ui/buttons/TextButton";
import React, { useEffect, useState } from "react";
import NotAvailable from "@/components/ui/NotAvailable";
import Loading from "@/components/ui/loading/Loading";
import { ChartData, User } from "@/types/types";
import { createClient } from "@/lib/supabase/client";
import PieChart2 from "@/components/ui/charts/PieChart2";

function PieChartDisplay({ user }: { readonly user: User | undefined }) {
  const [data, setData] = useState<ChartData[] | undefined>();

  const supabase = createClient();

  const getData = async () => {
    if (!user) {
      return;
    }

    const { data } = await supabase
      .from("projects")
      .select("id, name, contractors (id, name)")
      .eq("team_id", user.team_id)
      .throwOnError();

    const chart: ChartData[] = [];

    data.forEach((item) => {
      chart.push({ name: item.name, value: item.contractors?.length ?? 0 });
    });

    console.log(chart);
    setData(chart);
  };

  useEffect(() => {
    getData();
  }, [user]);

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
      {!data ? (
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
