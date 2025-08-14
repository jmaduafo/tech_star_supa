import { ChartData } from "@/types/types";
import React from "react";
import {
  BarChart as BarContainer,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function BarChart({ data }: { readonly data: ChartData[] }) {

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarContainer data={data}>
        <XAxis dataKey="name" stroke="rgba(236, 236, 236, 0.8)"/>
        <YAxis stroke="#ececec" hide />
        <Tooltip
          contentStyle={{
            backgroundColor: "#141414",
            borderRadius: "5px",
            padding: "6px 12px",
            border: "none",
          }}
          labelStyle={{ color: "#ececec", fontSize: "15px" }}
          itemStyle={{ color: "#ececec90", fontSize: "14px", marginTop: "-4px" }}
        />
        <Bar
          dataKey="value"
          activeBar={false}
          fill="#ececec"
          radius={[16, 16, 0, 0]}
        />
      </BarContainer>
    </ResponsiveContainer>
  );
}

export default BarChart;
