import { ChartData } from "@/types/types";
import React from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { COLORS } from "@/utils/dataTools";

function PieChart2({ data }: { readonly data: ChartData[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={60}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index + 1}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
        <Legend
          wrapperStyle={{
            fontSize: 13.5,
            color: "#ececec",
          }}
          content={({ payload }) => (
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              {payload?.map((entry, index) => (
                <li
                  key={`item-${index}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 4,
                  }}
                >
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%", // circle instead of square
                      backgroundColor: entry.color,
                      marginRight: 5,
                    }}
                  />
                  <span>{entry.value}</span>
                </li>
              ))}
            </ul>
          )}
        />
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
      </PieChart>
    </ResponsiveContainer>
  );
}

export default PieChart2;
