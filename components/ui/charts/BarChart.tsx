import React from "react";
import {
  BarChart as BarContainer,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";
import { COLORS } from "@/utils/dataTools";
import { formatCurrency } from "@/utils/currencies";
import { renderLegend } from "./legendStyle";
import { ContentType } from "recharts/types/component/DefaultLegendContent";

function BarChart({
  data,
  dataArray,
  format,
  code,
  maxSize
}: {
  readonly data: any[];
  readonly dataArray: string[];
  readonly format?: boolean;
  readonly code?: string;
  readonly maxSize?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%" className={"w-full h-full"}>
      <BarContainer data={data} accessibilityLayer>
        <CartesianGrid vertical={false} stroke="#ececec20" />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
          tick={{ fill: "#ececec90" }}
        />
        <YAxis stroke="rgba(236, 236, 236, 0.8)" allowDecimals={false} hide />
        <Tooltip
          contentStyle={{
            backgroundColor: "#141414",
            borderRadius: "5px",
            padding: "6px 12px",
            border: "none",
          }}
          cursor={{ fill: "#ececec30" }} // Changes color of screen behind the cells
          labelStyle={{ color: "#ececec", fontSize: "15px" }}
          itemStyle={{
            color: "#ececec90",
            fontSize: "14px",
            marginTop: "-4px",
          }}
          formatter={(value) =>
            format && code ? `${formatCurrency(+value, code)}` : value
          }
        />
        <Legend content={renderLegend as ContentType} />
        {dataArray.map((item, i) => {
          return (
            <Bar
              key={item}
              dataKey={item}
              activeBar={false}
              fill={COLORS[i % COLORS.length]}
              radius={[2, 2, 0, 0]}
              maxBarSize={maxSize ?? undefined}
            />
          );
        })}
      </BarContainer>
    </ResponsiveContainer>
  );
}

export default BarChart;
