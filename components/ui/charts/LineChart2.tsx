import { ChartData } from "@/types/types";
import { formatCurrency } from "@/utils/currencies";
import React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { renderLegend } from "./legendStyle";
import { ContentType } from "recharts/types/component/DefaultLegendContent";

function LineChart2({
  data,
  dataKey,
  code,
  format,
  dateFormat,
}: {
  readonly data: ChartData[];
  readonly dataKey?: string;
  readonly code?: string;
  readonly format?: boolean;
  readonly dateFormat?: boolean;
}) {
  return (
    <ResponsiveContainer width="100%" height="80%">
      <LineChart data={data}>
        <CartesianGrid vertical={false} stroke="#14141420" />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
          tick={{ fill: "#14141490" }}
          tickFormatter={(value) => {
            if (dateFormat) {
              return new Date(value).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });
            } else {
              return value;
            }
          }}
        />
        <Legend content={renderLegend as ContentType}/>
        <Line type="monotone" dataKey={dataKey ?? "value"} stroke="#141414" />
        <Tooltip
          contentStyle={{
            backgroundColor: "#141414",
            borderRadius: "5px",
            border: "none",
            color: "#ececec"
          }}
          itemStyle={{
            fontSize: "13px",
            color: "rgba(236, 236, 236, .8)",
          }}
          labelFormatter={(value) => {
            if (dateFormat) {
              return new Date(value).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });
            } else {
              return value;
            }
          }}
          formatter={(value) =>
            format && code ? `${formatCurrency(+value, code)}` : value
          }
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default LineChart2;
