"use client";

import Header5 from "@/components/fontsize/Header5";
import Header6 from "@/components/fontsize/Header6";
import LineChart2 from "@/components/ui/charts/LineChart2";
import ChartHeading from "@/components/ui/labels/ChartHeading";
import Loading from "@/components/ui/loading/Loading";
import { createClient } from "@/lib/supabase/client";
import { Activity, User } from "@/types/types";
import { activitiesBar } from "@/utils/chartHelpers";
import { switchPeriod } from "@/utils/dateAndTime";
import React, { useEffect, useState } from "react";

function ActivitiesBar({
  timePeriod,
  user,
}: {
  readonly timePeriod: string;
  readonly user: User | undefined;
}) {
  const [data, setData] = useState<Activity[] | undefined>();
  const [chartData, setChartData] = useState<any[] | undefined>();
  const supabase = createClient();

  const getData = async () => {
    if (!user) {
      return;
    }

    const { data } = await supabase
      .from("activities")
      .select("id, created_at")
      .eq("team_id", user.team_id)
      .order("created_at", { ascending: true })
      .throwOnError();

    setData(data as Activity[]);

    const chart = activitiesBar(data as Activity[], switchPeriod(timePeriod));

    setChartData(chart);
  };

  useEffect(() => {
    getData();
  }, [user]);

  useEffect(() => {
    if (data) {
      const chart = activitiesBar(data as Activity[], switchPeriod(timePeriod));

      setChartData(chart);
    }
  }, [timePeriod]);

  return (
    <div className="h-full">
      {!chartData ? (
        <div className="h-full w-full flex justify-center items-center">
          <Loading />
        </div>
      ) : (
        <div className="h-full w-full flex flex-col">
          <div>
            <ChartHeading
              text="Past Activities"
              subtext={
                timePeriod !== "All Time"
                  ? `Showing activities over the past ${switchPeriod(
                      timePeriod
                    )}`
                  : "Showing all past activities"
              }
            />
          </div>
          <div className="mt-auto h-[35vh]">
            <LineChart2 data={chartData} dataKey="activityCount" />
          </div>
        </div>
      )}
    </div>
  );
}

export default ActivitiesBar;
