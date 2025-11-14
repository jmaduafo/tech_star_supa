import React from "react";
import Card from "./MyCard";
import Header6 from "@/components/fontsize/Header6";
import Header2 from "@/components/fontsize/Header2";
import { convertCurrency, getPercentChange } from "@/utils/currencies";
import PercentBanner from "../banners/PercentBanner";
import { Versus } from "@/types/types";
import Paragraph from "@/components/fontsize/Paragraph";

type Kpi = {
  readonly item: {
    title: string;
    symbol: string | null;
    visual: boolean;
    className?: string;
  };
  readonly arr: Versus[];
  readonly index: number;
  readonly period?: string;
};

function KpiCard({ item, arr, index, period }: Kpi) {
  return (
    <Card className={`${item.className} flex flex-col min-h-32`}>
      <Header6 text={item.title} className="capitalize" />
      {item.visual &&
        period !== "All Time" &&
        period?.toLowerCase() !== "custom" && (
          <div className="flex gap-1 items-end -mt-0.5 mb-3">
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
            <Paragraph
              text={`vs. last ${period}`}
              className="text-darkText/60"
            />
          </div>
        )}
      <div
        className={`${
          +convertCurrency(arr[index].currentAmount) < 0
            ? "text-decrease"
            : "text-darkText"
        } font-light mt-auto flex items-start justify-end gap-1`}
      >
        {item.symbol ? <p className="text-sm">{item.symbol}</p> : null}
        <Header2 text={`${convertCurrency(arr[index].currentAmount)}`} />
      </div>
    </Card>
  );
}

export default KpiCard;
