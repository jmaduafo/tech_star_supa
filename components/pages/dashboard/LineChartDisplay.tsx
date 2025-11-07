"use client";
import React, { useState, useEffect } from "react";
import TextButton from "@/components/ui/buttons/TextButton";
import { Amount, LineData, Project } from "@/types/types";
import NotAvailable from "@/components/ui/NotAvailable";
import { chartFormatTotal } from "@/utils/chartHelpers";
import LineChart2 from "@/components/ui/charts/LineChart2";
import { sortDate } from "@/utils/sortFilter";
import ChartHeading from "@/components/ui/labels/ChartHeading";
import { checkArray } from "@/utils/currencies";
import { versusLast } from "@/utils/dateAndTime";

function LineChartDisplay({
  projects,
  currencies,
  selectedCurrency,
  selectedProject,
  period,
  customStart,
  customEnd,
}: {
  readonly projects: Project[] | undefined;
  readonly currencies: Amount[] | undefined;
  readonly selectedProject: string;
  readonly selectedCurrency: string;
  readonly customStart: string;
  readonly customEnd: string;
  readonly period: string;
}) {
  const [filteredData, setFilteredData] = useState<LineData[] | undefined>();

  const getData = () => {
    if (
      !projects ||
      !currencies ||
      !selectedCurrency.length ||
      !selectedProject.length
    ) {
      return;
    }

    const paymentAmounts: Amount[] = [];
    const chart: LineData[] = [];

    const project = projects.find((item) => item.id === selectedProject);

    if (!project) {
      return;
    }

    project.payments?.forEach((payment) => {
      const amount = checkArray(payment.payment_amounts);

      if (amount) {
        chart.push({
          name: payment.date,
          value: +amount.amount,
          project_id: selectedProject,
          code: amount.code,
        });

        payment.is_paid && paymentAmounts.push({ ...amount });
      }
    });

    // SORT CHART BY DATE IN ASCENDING ORDER (NAME KEY IS THE DATE)
    const sortedChart = sortDate(chart, "name", true);
    // FILTER BY THE FIRST PROJECT AND THE FIRST CODE LISTED
    const filterChart =
      period.toLowerCase().includes("custom") &&
      customStart.length &&
      customEnd.length
        ? sortedChart.filter(
            (item) =>
              item.project_id === selectedProject &&
              item.code === selectedCurrency &&
              versusLast(item.name, period, customStart, customEnd).current
          )
        : sortedChart.filter(
            (item) =>
              item.project_id === selectedProject &&
              item.code === selectedCurrency &&
              versusLast(item.name, period).current
          );

    // ACCUMULATE TOTAL AMOUNTS BASED ON THE DATE
    // EXAMPLE: AUG 12, 2021 => 309.45; AUG 12, 2021 => 405.00; AUG 19, 2021 => 203.76
    // OUTPUT: AUG 12, 2021 => 714.45; AUG 19, 2021 => 203.76
    // name => date; value => amount
    setFilteredData(chartFormatTotal(filterChart, "name", "value"));
  };

  useEffect(() => {
    getData();
  }, [
    projects,
    currencies,
    selectedProject,
    selectedCurrency,
    period,
    customStart,
    customEnd,
  ]);

  const switchPeriod = () => {
    if (period === "custom") {
      if (customStart.length && customEnd.length) {
        return `from ${customStart} to ${customEnd}`;
      } else {
        return "from -";
      }
    } else if (period === "day") {
      return "within the last 24 hours";
    } else if (period === "") {
      return "";
    } else {
      return "within the last 1 " + period;
    }
  };

  return (
    <div className="h-[50vh] flex flex-col">
      <div className="mb-4">
        <div className="flex gap-10 justify-between items-start">
          <div>
            <ChartHeading
              text="At a Glance"
              subtext={`All ${selectedCurrency} payments made for project ${
                projects?.find((item) => item.id === selectedProject)?.name ??
                "-"
              } ${switchPeriod()}`}
            />
          </div>
          {filteredData ? (
            <div className="">
              <TextButton
                href="/reports"
                text="See more"
                iconDirection="right"
              />
            </div>
          ) : null}
        </div>
      </div>

      <div className="w-full h-full flex-1">
        {filteredData?.length && selectedCurrency.length ? (
          <div className="mt-8 w-full h-full">
            <LineChart2
              data={filteredData}
              code={selectedCurrency}
              dateFormat
              format
            />
          </div>
        ) : (
          <div className="h-full flex justify-center items-center">
            <NotAvailable text="No payments available for visual data" />
          </div>
        )}
      </div>
    </div>
  );
}

export default LineChartDisplay;
