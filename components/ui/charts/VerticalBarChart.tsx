import React from "react";
import {
  BarChart as BarContainer,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { COLORS } from "@/utils/dataTools";
import { formatCurrency } from "@/utils/currencies";

function VerticalBarChart({
  data,
  dataArray,
  format,
  code,
  maxSize,
}: {
  readonly data: any[];
  readonly dataArray: string[];
  readonly format?: boolean;
  readonly code?: string;
  readonly maxSize?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%" className={"w-full h-full"}>
      <BarContainer data={data} accessibilityLayer layout="vertical" className="z-[60]">
        <CartesianGrid vertical={false} stroke="#14141420" strokeOpacity={0} />
        <XAxis
          type="number"
          
          tickMargin={8}
          minTickGap={32}
          tick={{ fill: "#14141490" }}
          hide
        />
        <YAxis
          dataKey="name"
          type="category"
          tickLine={false}
          tickFormatter={(value) =>
            value.slice(0, 6) + "..."}
          axisLine={false}
          tickMargin={2}
          minTickGap={32}
          tick={{ fill: "#14141490", fontSize: "12.5px" }}
          stroke="rgba(20, 20, 20, 0.8)"
          
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#141414",
            borderRadius: "5px",
            padding: "6px 12px",
            border: "none",
        
          }}
          cursor={{ fill: "#d6d3d160", }} // Changes color of screen behind the cells
          labelStyle={{ color: "#ececec", fontSize: "15px", zIndex: "400" }}
          itemStyle={{
            color: "rgba(236, 236, 236, .8)",
            fontSize: "14px",
            marginTop: "-4px",
            
          }}
          formatter={(value) =>
            format && code ? `${formatCurrency(+value, code)}` : value
          }
        />
        {/* <Legend content={renderLegend as ContentType} /> */}
        {dataArray.map((item, i) => {
          return (
            <Bar
              key={item}
              dataKey={item}
              activeBar={false}
              fill={COLORS[i % COLORS.length]}
              radius={[100, 100, 100, 100]}
              maxBarSize={maxSize ?? undefined}
              
            />
          );
        })}
      </BarContainer>
    </ResponsiveContainer>
  );
}

export default VerticalBarChart;
