import { formatCurrency } from "@/utils/currencies";
import { COLORS } from "@/utils/dataTools";
import React from "react";
import {
  Area,
  AreaChart as AreaChartContainer,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function AreaChart({
  data,
  dataKeys,
  code,
  format,
}: {
  readonly data: any[];
  readonly dataKeys: string[];
  readonly code?: string;
  readonly format?: boolean;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChartContainer
        width={730}
        height={250}
        data={data}
        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
      >
        <defs>
          {dataKeys.map((key, i) => {
            return (
              <linearGradient
                key={key}
                id={`color${key}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={COLORS[i]} stopOpacity={0.8} />
                <stop offset="95%" stopColor={COLORS[i]} stopOpacity={0} />
              </linearGradient>
            );
          })}
        </defs>
        <Legend />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
          tick={{ fill: "#ececec90" }}
        />
        <YAxis hide />
        <CartesianGrid vertical={false} stroke="#ececec20" />
        <Tooltip
          contentStyle={{
            backgroundColor: "#141414",
            borderRadius: "5px",
            border: "none",
          }}
          itemStyle={{
            fontSize: "13px",
            color: "#ececec",
          }}
          formatter={(value) =>
            format && code ? `${formatCurrency(+value, code)}` : value
          }
        />
        {dataKeys.map((key, i) => {
          return (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stroke={COLORS[i]}
              fillOpacity={1}
              fill={`url(#color${key})`}
            />
          );
        })}
      </AreaChartContainer>
    </ResponsiveContainer>
  );
}

export default AreaChart;
