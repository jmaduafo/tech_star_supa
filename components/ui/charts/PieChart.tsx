"use client";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import React from "react";
import { PieChart as PieContainer, Pie } from "recharts";

type Chart = {
  project_id: string;
  project_name: string;
  contractors: number | undefined;
  fill: string;
};

function PieChart({
  data,
  chartConfig,
  dataKey,
  nameKey,
}: {
  readonly data: Chart[];
  readonly chartConfig: ChartConfig;
  readonly nameKey: string;
  readonly dataKey: string;
}) {
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[250px]"
    >
      <PieContainer>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent />}
        />
        <Pie data={data} dataKey={dataKey} nameKey={nameKey} stroke="0" />
        {data.length > 0 && (
          <ChartLegend
            content={<ChartLegendContent nameKey={nameKey} />}
            className="-translate-y-2 w-full flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
          />
        )}
      </PieContainer>
    </ChartContainer>
  );
}

export default PieChart;
