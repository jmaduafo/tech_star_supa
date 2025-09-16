import React from "react";
import Card from "./MyCard";
import Header6 from "@/components/fontsize/Header6";
import Header2 from "@/components/fontsize/Header2";
import { convertCurrency, getPercentChange } from "@/utils/currencies";
import PercentBanner from "../banners/PercentBanner";

type Kpi = {
  readonly item: { title: string; symbol: string | null; visual: boolean };
  readonly arr: { currentAmount: number; previousAmount: number }[];
  readonly i: number;
};

function KpiCard({ item, arr, i }: Kpi) {
  return (
    <Card>
      <Header6 text={item.title} className="capitalize" />
      <div className="flex justify-end items-start gap-1 mt-8">
        <div className="flex items-start gap-1">
          {item.symbol ? <p className="text-sm">{item.symbol}</p> : null}
          <Header2 text={`${convertCurrency(arr[i].currentAmount)}`} />
        </div>
        {item.visual && (
          <PercentBanner
            type={
              getPercentChange(arr[i].currentAmount, arr[i].previousAmount).type
            }
            percent={
              getPercentChange(arr[i].currentAmount, arr[i].previousAmount)
                .percent
            }
          />
        )}
      </div>
    </Card>
  );
}

export default KpiCard;
