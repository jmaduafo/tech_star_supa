import { ColorData } from "@/types/types";
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

function BarChart({
  data,
  dataArray,
}: {
  readonly data: any[];
  readonly dataArray: ColorData[];
}) {
  return (
    <ResponsiveContainer width="100%" height="100%" className={"w-full h-full"}>
      <BarContainer data={data} accessibilityLayer>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(236, 236, 236, 0.3)"/>
        <XAxis dataKey="name" stroke="rgba(236, 236, 236, 0.8)" />
        <YAxis stroke="rgba(236, 236, 236, 0.8)" allowDecimals={false} hide/>
        <Tooltip
          contentStyle={{
            backgroundColor: "#141414",
            borderRadius: "5px",
            padding: "6px 12px",
            border: "none",
            zIndex: 1000
          }}
          cursor={{ fill: '#ececec30' }} // Changes color of screen behind the cells
          labelStyle={{ color: "#ececec", fontSize: "15px" }}
          itemStyle={{
            color: "#ececec90",
            fontSize: "14px",
            marginTop: "-4px",
          }}
        />
        <Legend iconSize={8} wrapperStyle={{ textTransform: "capitalize"}}/>
        {dataArray.map((item) => {
          return (
            <Bar
              key={item.name}
              dataKey={item.name}
              activeBar={false}
              fill={item.color}
              radius={[8, 8, 0, 0]}
            />
          );
        })}
      </BarContainer>
    </ResponsiveContainer>
  );
}

export default BarChart;
