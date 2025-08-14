"use client";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart as LineContainer,
  Line,
  CartesianGrid,
  XAxis,
} from "recharts";
import React from "react";

type Chart = {
  amount: string;
  date: string;
};

function LineChart({
  chartConfig,
  chartData,
}: {
  readonly chartConfig: ChartConfig;
  readonly chartData: Chart[];
}) {
  return (
    <div
      // style={{ position: "relative", width: "100%", height: "100%" }}
      className="relative w-full h-full"
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          top: 0,
        }}
        className=""
      >
        <ChartContainer config={chartConfig} className="text-lightText">
          <LineContainer
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
            
          >
            <CartesianGrid vertical={false} stroke="#ffffff20"/>
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: "white", fontSize: 14 }} 
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="amount"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Line
              dataKey="amount"
              type="natural"
              stroke="white"
              strokeWidth={2}
              dot={false}
            />
          </LineContainer>
        </ChartContainer>
      </div>
    </div>
  );
}

export default LineChart;
