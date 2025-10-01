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

function PieChart2({ data, dataKey }: { readonly data: any[]; readonly dataKey?: string }) {
  return (
    <ResponsiveContainer width="100%" height="80%" className={"w-full h-full"}>
      <PieChart>   
        <Pie
          data={data}
          dataKey={dataKey ?? "value"}
          nameKey="name"
          cx="50%"
          cy="50%"
          label={data.length === 1 ? ({ name, value }) => `${name}: ${value}` : undefined}
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
            color: "#141414",
          }}
          content={({ payload }) => (
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexWrap: "wrap",

                alignItems: "center",
                justifyContent: "center",
                rowGap: 3,
                columnGap: 10
              }}
            >
              {payload?.map((entry, index) => (
                <li
                  key={`item-${index + 1}`}
                  style={{
                    display: "flex",
                    gap: 4,
                    alignItems: "center",
                    marginBottom: 4,
                  }}
                >
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderWidth: "1px",
                      borderColor: "#14141410",
                      borderRadius: "20%", // circle instead of square
                      backgroundColor: entry.color,
                      marginRight: 5,
                    }}
                  />
                  <span className="whitespace-nowrap text-sm 2xl:text-base">{entry.value}</span>
                </li>
              ))}
            </ul>
          )}
        />
        { data.length > 1 ? <Tooltip
          contentStyle={{
            backgroundColor: "#141414",
            borderRadius: "5px",
            border: "none",
            color: "#ececec"
          }}
          itemStyle={{
            fontSize: "13px",
            color: "#ececec90",
          }}
        /> : null}
      </PieChart>
    </ResponsiveContainer>
  );
}

export default PieChart2;
