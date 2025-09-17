import React from "react";
import Card from "./MyCard";
import Header6 from "@/components/fontsize/Header6";
import Header2 from "@/components/fontsize/Header2";
import { convertCurrency, getPercentChange } from "@/utils/currencies";
import PercentBanner from "../banners/PercentBanner";
import { Versus } from "@/types/types";

type Kpi = {
  readonly item: { title: string; symbol: string | null; visual: boolean };
  readonly arr: Versus[];
  readonly index: number;
  readonly period?: string;
};

function KpiCard({ item, arr, index, period }: Kpi) {
  return (
    <Card className="flex flex-col min-h-32">
      <Header6 text={item.title} className="capitalize" />
      <div className="flex justify-end items-start gap-1 mt-auto">
        <div className="flex items-start gap-1">
          {item.symbol ? <p className="text-sm">{item.symbol}</p> : null}
          <Header2 text={`${convertCurrency(arr[index].currentAmount)}`} />
        </div>
        {item.visual && period !== "All Time" && (
          <PercentBanner
            type={
              getPercentChange(
                arr[index].currentAmount,
                arr[index].previousAmount
              ).type
            }
            percent={
              getPercentChange(
                arr[index].currentAmount,
                arr[index].previousAmount
              ).percent
            }
          />
        )}
      </div>
    </Card>
  );
}

export default KpiCard;
