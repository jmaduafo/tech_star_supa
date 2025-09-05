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
        <XAxis dataKey="name" />
        <Legend />
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
          />
        ) : null}
      </LineChart>
    </ResponsiveContainer>
  );
}

export default LineChart2;
