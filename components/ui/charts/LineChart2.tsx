import { ChartData } from "@/types/types";
import React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function LineChart2({ data }: { readonly data: ChartData[] }) {
  return (
    <ResponsiveContainer width="100%" height="80%">
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid vertical={false} stroke="#ececec20" />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
          tickFormatter={(value) => {
            const date = new Date(value);
            return date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });
          }}
        />
        {/* <Legend /> */}
        <Line type="monotone" dataKey="value" stroke="#ececec" />
        {data.length > 1 ? (
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
            labelFormatter={(value) => {
              return new Date(value).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });
            }}
          />
        ) : null}
      </LineChart>
    </ResponsiveContainer>
  );
}

export default LineChart2;
